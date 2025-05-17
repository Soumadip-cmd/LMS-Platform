import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import BlogContext from '../../context/blog/blogContext';
import AuthContext from '../../context/auth/authContext';
import { SERVER_URI } from '../../utlils/ServerUri';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saveInfo, setSaveInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use refs instead of state to avoid re-renders
  const loadingAttemptsRef = useRef(0);
  const hasLoadedRef = useRef(false);
  const isMountedRef = useRef(true);
  const popularBlogsLoadedRef = useRef(false);

  // Get blog context
  const blogContext = useContext(BlogContext);
  const { blog, relatedBlogs, popularBlogs, loading, getBlog, getPopularBlogs, addComment, clearBlog } = blogContext;

  // Get auth context
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user } = authContext;

  // Memoized blog loading function to prevent infinite renders
  const loadBlogData = useCallback(async (blogId) => {
    // Skip if already loaded or unmounted
    if (hasLoadedRef.current || !isMountedRef.current) {
      console.log(`BlogDetail: Skipping load for ID: ${blogId} (already loaded or unmounted)`);
      return;
    }

    // Skip if blog is already loaded in context
    if (blog && blog._id === blogId) {
      console.log(`BlogDetail: Blog with ID ${blogId} already loaded in context`);
      hasLoadedRef.current = true;
      setIsLoading(false);
      return;
    }

    // Increment attempt counter
    loadingAttemptsRef.current += 1;

    console.log(`BlogDetail: Loading blog data for ID: ${blogId}, attempt: ${loadingAttemptsRef.current}`);
    setIsLoading(true);

    try {
      // Clear any existing blog data first to prevent stale data
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
    // Skip if already loaded or unmounted
    if (popularBlogsLoadedRef.current || !isMountedRef.current) {
      console.log("BlogDetail: Skipping popular blogs load (already loaded or unmounted)");
      return;
    }

    // Skip if popular blogs are already loaded in context
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
    // Skip if the component is already unmounted
    if (!isMountedRef.current) return;

    console.log("BlogDetail: Initial load effect for blog ID:", id);

    // Set mounted flag
    isMountedRef.current = true;

    // Reset loading state on new ID
    hasLoadedRef.current = false;
    loadingAttemptsRef.current = 0;
    popularBlogsLoadedRef.current = false;

    // Reset loading state
    setIsLoading(true);

    // Create a single load function to avoid race conditions
    const loadData = async () => {
      // Skip if the component is unmounted
      if (!isMountedRef.current) return;

      // Skip if already loaded
      if (hasLoadedRef.current) return;

      // Skip if too many attempts
      if (loadingAttemptsRef.current >= 3) return;

      try {
        // Load blog data first
        await loadBlogData(id);

        // Then load popular blogs if needed
        if (isMountedRef.current) {
          loadPopularBlogs();
        }
      } catch (error) {
        console.error("BlogDetail: Error in loadData:", error);
      }
    };

    // Execute the load function
    loadData();

    // If user is authenticated, pre-fill name and email
    if (isAuthenticated && user) {
      setName(user.username || '');
      setEmail(user.email || '');
    }

    // Load saved info from localStorage if available
    const savedName = localStorage.getItem('blogCommentName');
    const savedEmail = localStorage.getItem('blogCommentEmail');
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);

    // Check if user wants to save info
    const savedInfoPref = localStorage.getItem('blogCommentSaveInfo');
    if (savedInfoPref === 'true') setSaveInfo(true);

    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Cleanup function to prevent memory leaks
    return () => {
      console.log("BlogDetail: Cleanup - component unmounted");
      // Mark component as unmounted
      isMountedRef.current = false;
      // Reset loading state when component unmounts
      setIsLoading(false);
      // Reset refs
      hasLoadedRef.current = false;
      popularBlogsLoadedRef.current = false;
      // Clear blog data from context to prevent stale data
      clearBlog();
    };
  }, [id, isAuthenticated, user, loadBlogData, loadPopularBlogs, clearBlog]);

  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();

    // Save info to localStorage if checkbox is checked
    if (saveInfo) {
      localStorage.setItem('blogCommentName', name);
      localStorage.setItem('blogCommentEmail', email);
      localStorage.setItem('blogCommentSaveInfo', 'true');
    } else {
      // Clear saved info if checkbox is unchecked
      localStorage.removeItem('blogCommentName');
      localStorage.removeItem('blogCommentEmail');
      localStorage.removeItem('blogCommentSaveInfo');
    }

    // Add comment
    if (isAuthenticated) {
      addComment(id, { text: comment });
      setComment('');
    } else {
      // Redirect to login if not authenticated
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
                  // Reset loading state
                  loadingAttemptsRef.current = 0;
                  hasLoadedRef.current = false;
                  popularBlogsLoadedRef.current = false;
                  setIsLoading(true);

                  // Clear existing blog data
                  clearBlog();

                  // Try loading again
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
          <span>Leave a Comment / By {blog.author?.username || 'TEAM PREPLINGS'} / {formatDate(blog.createdAt)}</span>
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
