

import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Heart, User } from 'lucide-react';
import BlogContext from '../../context/blog/blogContext';
import AuthContext from '../../context/auth/authContext';
import { SERVER_URI } from '../../utlils/ServerUri';
import { io } from 'socket.io-client';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saveInfo, setSaveInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Use refs instead of state to avoid re-renders
  const loadingAttemptsRef = useRef(0);
  const hasLoadedRef = useRef(false);
  const isMountedRef = useRef(true);
  const popularBlogsLoadedRef = useRef(false);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(SERVER_URI);
    setSocket(newSocket);

    // Join the blog room
    if (id) {
      newSocket.emit('joinBlog', id);
    }

    // Listen for real-time updates
    newSocket.on('newComment', (data) => {
      if (data.blogId === id) {
        getBlog(id);
      }
    });

    newSocket.on('newReply', (data) => {
      if (data.blogId === id) {
        getBlog(id);
      }
    });

    newSocket.on('commentLikeUpdate', (data) => {
      if (data.blogId === id) {
        getBlog(id);
      }
    });

    return () => {
      if (newSocket) {
        newSocket.emit('leaveBlog', id);
        newSocket.disconnect();
      }
    };
  }, [id]);

  // Get blog context
  const blogContext = useContext(BlogContext);
  const { blog, relatedBlogs, popularBlogs, loading, getBlog, getPopularBlogs, addComment, clearBlog, addCommentReply, toggleCommentLike, toggleReplyLike } = blogContext;

  // Get auth context
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user } = authContext;

  const handleReplySubmit = async (commentId) => {
    if (!replyText.trim()) return;

    try {
      await addCommentReply(id, commentId, replyText);
      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      await toggleCommentLike(id, commentId);
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleReplyLike = async (commentId, replyId) => {
    try {
      await toggleReplyLike(id, commentId, replyId);
    } catch (error) {
      console.error('Error liking reply:', error);
    }
  };

  // Memoized blog loading function to prevent infinite renders
  const loadBlogData = useCallback(async (blogId) => {
    if (hasLoadedRef.current || !isMountedRef.current) {
      console.log(`BlogDetail: Skipping load for ID: ${blogId} (already loaded or unmounted)`);
      return;
    }

    if (blog && blog._id === blogId) {
      console.log(`BlogDetail: Blog with ID ${blogId} already loaded in context`);
      hasLoadedRef.current = true;
      setIsLoading(false);
      return;
    }

    loadingAttemptsRef.current += 1;

    console.log(`BlogDetail: Loading blog data for ID: ${blogId}, attempt: ${loadingAttemptsRef.current}`);
    setIsLoading(true);

    try {
      if (blog && blog._id !== blogId) {
        clearBlog();
      }

      const result = await getBlog(blogId);

      if (isMountedRef.current) {
        if (result) {
          console.log("BlogDetail: Blog loaded successfully");
          hasLoadedRef.current = true;
        } else {
          console.log("BlogDetail: Blog load returned null (likely already in progress)");
        }
        setIsLoading(false);
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error("BlogDetail: Error loading blog:", error);
        setIsLoading(false);
      }
    }
  }, [getBlog, blog, clearBlog]);

  // Memoized popular blogs loading function
  const loadPopularBlogs = useCallback(() => {
    if (popularBlogsLoadedRef.current || !isMountedRef.current) {
      console.log("BlogDetail: Skipping popular blogs load (already loaded or unmounted)");
      return;
    }

    if (popularBlogs && popularBlogs.length >= 8) {
      console.log(`BlogDetail: Popular blogs already loaded in context (${popularBlogs.length})`);
      popularBlogsLoadedRef.current = true;
      return;
    }

    console.log("BlogDetail: Loading popular blogs");
    getPopularBlogs(8);
    popularBlogsLoadedRef.current = true;
  }, [getPopularBlogs, popularBlogs]);

  // Load blog when component mounts
  useEffect(() => {
    if (!isMountedRef.current) return;

    console.log("BlogDetail: Initial load effect for blog ID:", id);

    isMountedRef.current = true;

    hasLoadedRef.current = false;
    loadingAttemptsRef.current = 0;
    popularBlogsLoadedRef.current = false;

    setIsLoading(true);

    const loadData = async () => {
      if (!isMountedRef.current) return;
      if (hasLoadedRef.current) return;
      if (loadingAttemptsRef.current >= 3) return;

      try {
        await loadBlogData(id);

        if (isMountedRef.current) {
          loadPopularBlogs();
        }
      } catch (error) {
        console.error("BlogDetail: Error in loadData:", error);
      }
    };

    loadData();

    if (isAuthenticated && user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }

    const savedName = localStorage.getItem('blogCommentName');
    const savedEmail = localStorage.getItem('blogCommentEmail');
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);

    const savedInfoPref = localStorage.getItem('blogCommentSaveInfo');
    if (savedInfoPref === 'true') setSaveInfo(true);

    window.scrollTo(0, 0);

    return () => {
      console.log("BlogDetail: Cleanup - component unmounted");
      isMountedRef.current = false;
      setIsLoading(false);
      hasLoadedRef.current = false;
      popularBlogsLoadedRef.current = false;
      clearBlog();
    };
  }, [id, isAuthenticated, user, loadBlogData, loadPopularBlogs, clearBlog]);

  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();

    if (saveInfo) {
      localStorage.setItem('blogCommentName', name);
      localStorage.setItem('blogCommentEmail', email);
      localStorage.setItem('blogCommentSaveInfo', 'true');
    } else {
      localStorage.removeItem('blogCommentName');
      localStorage.removeItem('blogCommentEmail');
      localStorage.removeItem('blogCommentSaveInfo');
    }

    if (isAuthenticated) {
      addComment(id, comment);
      setComment('');
    } else {
      alert("Please Login to access the resources!")
      navigate('/auth/login', { state: { from: `/blog/${id}` } });
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Check if we have a valid blog
  const hasBlog = blog && blog._id === id;

  // Avatar component for users
const UserAvatar = ({ user, size = 'w-8 h-8' }) => {
  const [imageError, setImageError] = useState(false);
  
  // Get user initials
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const initials = getInitials(user?.name);
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-indigo-500'];
  const colorIndex = user?.name ? user.name.charCodeAt(0) % colors.length : 0;
  const bgColor = colors[colorIndex];
  
  // Check if user has a valid photo URL and no error occurred
  if (user?.photoUrl && user.photoUrl.trim() !== '' && !imageError) {
    return (
      <img
        src={user.photoUrl}
        alt={user.name || 'User'}
        className={`${size} rounded-full mr-2 object-cover border-2 border-gray-200`}
        onError={() => setImageError(true)}
      />
    );
  }
  
  // Show initials with colored background
  return (
    <div className={`${size} rounded-full ${bgColor} flex items-center justify-center mr-2 shadow-sm`}>
      {initials ? (
        <span className="text-white font-semibold text-xs">
          {initials}
        </span>
      ) : (
        <User size={size === 'w-8 h-8' ? 18 : 14} className="text-white" />
      )}
    </div>
  );
};

  // Loading state
  if ((isLoading || loading) && !hasBlog) {
    console.log("BlogDetail: Loading state. isLoading:", isLoading, "contextLoading:", loading, "hasBlog:", hasBlog, "Attempts:", loadingAttemptsRef.current);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-500">Loading blog content...</p>
        <p className="text-sm text-gray-400 mt-2">Blog ID: {id}</p>
        {loadingAttemptsRef.current > 0 && (
          <p className="text-sm text-yellow-600 mt-2">Retry attempt: {loadingAttemptsRef.current}/3</p>
        )}
        {loadingAttemptsRef.current >= 3 && (
          <div className="mt-4 text-center">
            <p className="text-red-500">Failed to load blog after multiple attempts</p>
            <div className="mt-4 flex gap-4 justify-center">
              <button
                onClick={() => {
                  loadingAttemptsRef.current = 0;
                  hasLoadedRef.current = false;
                  popularBlogsLoadedRef.current = false;
                  setIsLoading(true);
                  clearBlog();
                  setTimeout(() => {
                    if (isMountedRef.current) {
                      loadBlogData(id);
                    }
                  }, 500);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Try Again
              </button>
              <Link to="/blog" className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                Back to Blogs
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // No blog found after loading
  if (!isLoading && !loading && !hasBlog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-red-500 text-xl mb-4">Blog not found</div>
        <p className="text-gray-500 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link to="/blog" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FBFBFB] pt-32 pb-16 w-full overflow-x-hidden">
      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Link to="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft size={18} className="mr-1" />
            <span>Back to Blog</span>
          </Link>

          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft size={18} className="mr-1" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Blog title */}
        <h1 className="text-[#1976D2] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
          {blog.title}
        </h1>

        {/* Author and date info */}
        <div className="text-gray-500 text-sm mb-8">
          <span>Leave a Comment / By {blog.author?.name || 'TEAM PREPLINGS'} / {formatDate(blog.createdAt)}</span> 
        </div>

        {/* Featured image */}
        <div className="w-full mb-8 rounded-md overflow-hidden">
          <img
            src={blog.featuredImage || `${process.env.PUBLIC_URL}/assets/blog-placeholder.jpg`}
            alt={blog.title}
            className="w-full h-auto object-cover rounded-md"
          />
        </div>

        {/* Blog content */}
        <div className="prose max-w-none text-gray-600 mb-8">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        {/* Quote section */}
        <div className="my-8 flex">
          <div className="w-1 bg-[#7C4EE4]"></div>
          <div className="ml-2">
            <p className="text-[#1976D2] text-base mb-2">
              "People worry that computers will get too smart and take over the world, but the real problem is that they're too stupid and they've already taken over the world."
            </p>
            <p className="text-[#1976D2] font-medium">– Pedro Domingos</p>
          </div>
        </div>

        {/* Second image (if available) */}
        <div className="w-full my-8 rounded-md overflow-hidden">
          <img
            src={`${process.env.PUBLIC_URL}/assets/blog-image-2.jpg`}
            alt="Blog illustration"
            className="w-full h-auto object-cover rounded-md"
          />
        </div>

        {/* Leave a comment section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-4">Leave a Comment</h2>
          <p className="text-gray-500 mb-4">Your email address will not be published. Required fields are marked *</p>

          {/* Comment form */}
          <form onSubmit={handleCommentSubmit}>
            {/* Comment text area */}
            <div className="mb-4">
              <textarea
                className="w-full p-4 bg-gray-200 rounded-md"
                rows="6"
                placeholder="Type here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Save info checkbox */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="saveInfo"
                className="mr-2"
                checked={saveInfo}
                onChange={() => setSaveInfo(!saveInfo)}
              />
              <label htmlFor="saveInfo" className="text-gray-500 text-sm">
                Save my name and email in this browser for the next time I comment.
              </label>
            </div>

            {/* Name and email fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <input
                  type="text"
                  className="w-full p-4 bg-gray-200 rounded-md"
                  placeholder="Name*"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  className="w-full p-4 bg-gray-200 rounded-md"
                  placeholder="E-mail Address*"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full p-4 bg-[#1976D2] text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Comments Display Section */}
        {blog.comments && blog.comments.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">
              Comments ({blog.comments.length})
            </h3>
            
            {blog.comments.map((comment) => (
              <div key={comment._id} className="bg-white p-4 rounded-lg shadow-sm mb-4">
                {/* Comment Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <UserAvatar user={comment.user} />
                    <span className="font-medium">{comment.user?.name || 'Anonymous'}</span>
                    <span className="text-gray-500 text-sm ml-2">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  
                  {/* Comment Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCommentLike(comment._id)}
                      className="flex items-center text-gray-500 hover:text-blue-600"
                    >
                      <Heart size={16} className="mr-1" />
                      <span>{comment.likes?.length || 0}</span>
                    </button>
                    <button
                      onClick={() => setReplyingTo(
                        replyingTo === comment._id ? null : comment._id
                      )}
                      className="text-gray-500 hover:text-blue-600 text-sm"
                    >
                      Reply
                    </button>
                  </div>
                </div>
                
                {/* Comment Text */}
                <p className="text-gray-700 mb-2">{comment.text}</p>
                
                {/* Reply Form */}
                {replyingTo === comment._id && (
                  <div className="mt-3 ml-4">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full p-2 bg-gray-100 rounded text-sm"
                      rows="2"
                    />
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={() => handleReplySubmit(comment._id)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                        className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-6 mt-3 space-y-2">
                    {comment.replies.map((reply) => (
                      <div key={reply._id} className="bg-gray-50 p-3 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <UserAvatar user={reply.user} size="w-6 h-6" />
                            <span className="font-medium text-sm">{reply.user?.name || 'Anonymous'}</span>
                            <span className="text-gray-500 text-xs ml-2">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => handleReplyLike(comment._id, reply._id)}
                            className="flex items-center text-gray-500 hover:text-blue-600"
                          >
                            <Heart size={14} className="mr-1" />
                            <span className="text-xs">{reply.likes?.length || 0}</span>
                          </button>
                        </div>
                        <p className="text-gray-700 text-sm">{reply.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Popular posts section */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Popular Posts</h2>
            <Link to="/blog" className="text-gray-500 hover:text-gray-700">View All</Link>
          </div>

          {/* Popular posts grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularBlogs && popularBlogs.slice(0, 8).map((post) => (
              <Link to={`/blog/${post._id}`} key={post._id} className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 overflow-hidden">
                  <img
                    src={post.featuredImage || `${process.env.PUBLIC_URL}/assets/blog-placeholder.jpg`}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <Calendar size={14} className="mr-1" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <h3 className="text-[#1976D2] font-medium text-sm line-clamp-2">{post.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
