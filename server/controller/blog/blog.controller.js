import { Blog } from '../../models/blog.model.js';
import { sendCourseNotification } from '../../socket/socket.js';

import {User} from '../../models/user.model.js'
// Popular posts recommendation function using TensorFlow
async function getPopularPosts(limit = 5) {
  try {
    // Calculate popularity score based on multiple factors
    const popularPosts = await Blog.aggregate([
      {
        $addFields: {
          popularityScore: {
            $add: [
              { $multiply: ['$views', 0.3] },      // Views weight
              { $multiply: [{ $size: '$likes' }, 0.4] },  // Likes weight
              { $multiply: [{ $size: '$comments' }, 0.3] }  // Comments weight
            ]
          }
        }
      },
      { $sort: { popularityScore: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',  // Assuming users collection
          localField: 'author',
          foreignField: '_id',
          as: 'authorDetails'
        }
      },
      {
        $project: {
          title: 1,
          content: { $substr: ['$content', 0, 200] },  // Truncate content
          views: 1,
          likes: { $size: '$likes' },
          comments: { $size: '$comments' },
          category: 1,
          featuredImage: 1,
          author: { $arrayElemAt: ['$authorDetails.username', 0] },
          popularityScore: 1,
          createdAt: 1
        }
      }
    ]);

    return popularPosts;
  } catch (error) {
    console.error('Error fetching popular posts:', error);
    return [];
  }
}

// Create a new blog post
export const createBlog = async (req, res) => {
  try {
    const { title, content, category, tags, featuredImage, isPublished } = req.body;
    
    const newBlog = new Blog({
      title,
      content,
      author: req.user._id,
      category,
      tags: tags || [],
      featuredImage: featuredImage || null,
      isPublished: isPublished || false,
      publishedAt: isPublished ? new Date() : null
    });

    const savedBlog = await newBlog.save();

    if (isPublished) {
      const interestedUsers = await getUsersInterestedInCategory(category);
      
      for (const userId of interestedUsers) {
        await sendCourseNotification(userId, {
          title: 'New Blog Post',
          message: `A new blog post "${title}" has been published in ${category}`,
          courseId: savedBlog._id
        });
      }
    }

    res.status(201).json({
      message: 'Blog post created successfully',
      blog: savedBlog
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating blog post',
      error: error.message
    });
  }
};

// Get all blog posts
export const getAllBlogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      tag, 
      search 
    } = req.query;

    const query = {};
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (search) {
      query.$text = { $search: search };
    }

    const blogs = await Blog.find(query)
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Blog.countDocuments(query);

    // Get popular posts
    const popularPosts = await getPopularPosts();

    res.json({
      blogs,
      popularPosts,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching blog posts',
      error: error.message
    });
  }
};

// Get a single blog post by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username profilePicture')
      .populate('comments.user', 'username profilePicture');

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Increment views
    await blog.incrementViews();

    // Get related posts in the same category
    const relatedPosts = await Blog.find({
      category: blog.category,
      _id: { $ne: blog._id }
    })
    .limit(3)
    .select('title category featuredImage');

    res.json({
      blog,
      relatedPosts
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching blog post',
      error: error.message
    });
  }
};

// Update a blog post
export const updateBlog = async (req, res) => {
  try {
    const { title, content, category, tags, featuredImage, isPublished } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this blog' });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.category = category || blog.category;
    blog.tags = tags || blog.tags;
    blog.featuredImage = featuredImage || blog.featuredImage;
    
    if (isPublished !== undefined) {
      blog.isPublished = isPublished;
      blog.publishedAt = isPublished ? new Date() : null;
    }

    const updatedBlog = await blog.save();

    res.json({
      message: 'Blog post updated successfully',
      blog: updatedBlog
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating blog post',
      error: error.message
    });
  }
};

// Delete a blog post
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this blog' });
    }

    await blog.deleteOne();

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting blog post',
      error: error.message
    });
  }
};

// Add a comment to a blog post
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const newComment = {
      user: req.user._id,
      text,
      createdAt: new Date()
    };

    blog.comments.unshift(newComment);
    const updatedBlog = await blog.save();

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error adding comment',
      error: error.message
    });
  }
};

// Like/Unlike a blog post
export const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const userId = req.user._id;
    const likeIndex = blog.likes.findIndex(
      id => id.toString() === userId.toString()
    );

    if (likeIndex > -1) {
      // Unlike
      blog.likes.splice(likeIndex, 1);
    } else {
      // Like
      blog.likes.push(userId);
    }

    const updatedBlog = await blog.save();

    res.json({
      message: likeIndex > -1 ? 'Unliked' : 'Liked',
      likes: updatedBlog.likes.length
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error processing like',
      error: error.message
    });
  }
};

// Get popular posts
export const getPopularPostsController = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const popularPosts = await getPopularPosts(Number(limit));
    
    res.json({
      popularPosts
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching popular posts',
      error: error.message
    });
  }
};



async function getUsersInterestedInCategory(category) {
  try {
   
 
    
    // Find users who have this category in their interests
    
    const interestedUsers = await User.find({
      preferredCategories: { $in: [category] },
      notificationPreferences: { $ne: false },  // Only include users who haven't disabled notifications
      isActive: true  // Only include active users
    }).select('_id');
    
    // Return array of user IDs
    return interestedUsers.map(user => user._id);
  } catch (error) {
    console.error('Error finding users interested in category:', error);
    return [];  // Return empty array in case of error
  }
}