// src/routes/blog-search.routes.js
import express from 'express';
import { isAuthenticated } from '../../middlewares/isAuthenticated.js';
import { searchController } from '../../controller/blog/blog-search.controller.js';

const searchRouter = express.Router();

// Advanced Search Route
searchRouter.get(
  '/advanced', 
  searchController.advancedSearch
);

// Semantic Search Route
searchRouter.get(
  '/semantic', 
  searchController.semanticSearch
);

// Search Suggestions Route
searchRouter.get(
  '/suggestions', 
  searchController.getSearchSuggestions
);

// Personalized Recommendations Route
searchRouter.get(
  '/recommendations', 
  isAuthenticated,
  searchController.getPersonalizedRecommendations
);

export default searchRouter;