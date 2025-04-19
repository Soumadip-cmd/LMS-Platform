// src/routes/blog/blog.route.js
import express from 'express';
import { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog, addComment, toggleLike, getPopularPostsController } from '../../controller/blog/blog.controller.js';
import { isAuthenticated, isAdmin } from '../../middlewares/isAuthenticated.js';
import { validateBlogPost } from "../../middlewares/validation.middleware.js";

const blogRouter = express.Router();

// Create a new blog post (authenticated users only)
blogRouter.post(
  '/create', 
  isAuthenticated,
  validateBlogPost.create,
  createBlog
);

// Get all blog posts (public)
blogRouter.get(
  '/get-all', 
  getAllBlogs
);

// Get popular posts
blogRouter.get(
  '/popular', 
  getPopularPostsController
);

// Get a single blog post by ID (public)
blogRouter.get(
  '/get/:id', 
  getBlogById
);

// Update a blog post (authenticated and authorized users only)
blogRouter.put(
  '/update/:id', 
  isAuthenticated,
  validateBlogPost.update,
  updateBlog
);

// Delete a blog post (authenticated and authorized users only)
blogRouter.delete(
  '/delete/:id', 
  isAuthenticated,
  deleteBlog
);

// Add a comment to a blog post (authenticated users only)
blogRouter.post(
  '/:id/comments', 
  isAuthenticated,
  validateBlogPost.addComment,
  addComment
);

// Like/Unlike a blog post (authenticated users only)
blogRouter.post(
  '/:id/like', 
  isAuthenticated,
  toggleLike
);

export default blogRouter;