// src/middleware/blog-validation.middleware.js


export const validateBlogPost = {
  // Validate blog post creation
  create: (req, res, next) => {
    const { title, content, category } = req.body;
    
    // Check title
    if (!title || title.trim().length < 5) {
      return res.status(400).json({
        message: 'Title must be at least 5 characters long'
      });
    }
    
    // Check content
    if (!content || content.trim().length < 20) {
      return res.status(400).json({
        message: 'Content must be at least 20 characters long'
      });
    }
    
    // Check category
    const validCategories = ['Technology', 'VR', 'AI', 'Gaming', 'Education', 'Other'];
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({
        message: 'Invalid category',
        validCategories
      });
    }
    
    // Optional: Sanitize input (remove any potentially harmful HTML, etc.)
    req.body.title = title.trim();
    req.body.content = content.trim();
    
    next();
  },
  
  // Validate blog post update
  update: (req, res, next) => {
    const { title, content, category } = req.body;
    
    // If title is provided, validate it
    if (title && title.trim().length < 5) {
      return res.status(400).json({
        message: 'Title must be at least 5 characters long'
      });
    }
    
    // If content is provided, validate it
    if (content && content.trim().length < 20) {
      return res.status(400).json({
        message: 'Content must be at least 20 characters long'
      });
    }
    
    // Check category
    const validCategories = ['Technology', 'VR', 'AI', 'Gaming', 'Education', 'Other'];
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({
        message: 'Invalid category',
        validCategories
      });
    }
    
    // Sanitize inputs if provided
    if (title) req.body.title = title.trim();
    if (content) req.body.content = content.trim();
    
    next();
  },
  
  // Validate adding a comment
  addComment: (req, res, next) => {
    const { text } = req.body;
    
    // Validate comment text
    if (!text || text.trim().length < 2) {
      return res.status(400).json({
        message: 'Comment must be at least 2 characters long'
      });
    }
    
    // Validate comment length
    if (text.trim().length > 500) {
      return res.status(400).json({
        message: 'Comment cannot exceed 500 characters'
      });
    }
    
    // Sanitize comment text
    req.body.text = text.trim();
    
    next();
  }
};

export default validateBlogPost;