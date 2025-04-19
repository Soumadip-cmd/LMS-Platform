// src/controllers/blog-search.controller.js
import BlogSearchService from '../../services/blog/blog-search.js';
import BlogRecommendationService from '../../services/blog/blog-recommendation.js';

export const searchController = {
  // Advanced Search
  advancedSearch: async (req, res) => {
    try {
      const searchResults = await BlogSearchService.advancedSearch(req.query);
      res.json(searchResults);
    } catch (error) {
      res.status(500).json({ 
        message: 'Search failed', 
        error: error.message 
      });
    }
  },

  // Semantic Search
  semanticSearch: async (req, res) => {
    try {
      const { query, limit } = req.query;
      const semanticResults = await BlogSearchService.semanticSearch(query, Number(limit));
      res.json(semanticResults);
    } catch (error) {
      res.status(500).json({ 
        message: 'Semantic search failed', 
        error: error.message 
      });
    }
  },

  // Search Suggestions
  getSearchSuggestions: async (req, res) => {
    try {
      const { query } = req.query;
      const suggestions = await BlogSearchService.searchSuggestions(query);
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ 
        message: 'Search suggestions failed', 
        error: error.message 
      });
    }
  },

  // Personalized Recommendations
  getPersonalizedRecommendations: async (req, res) => {
    try {
      const userId = req.user._id;
      const recommendations = await BlogRecommendationService.getPersonalizedRecommendations(userId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ 
        message: 'Recommendations generation failed', 
        error: error.message 
      });
    }
  }
};

export default searchController;