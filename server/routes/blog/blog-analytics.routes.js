// src/routes/blog-analytics.routes.js
import express from 'express';
import { isAuthenticated, isAdmin } from '../../middlewares/isAuthenticated.js';
import { analyticsController } from '../../controller/blog/blog-analytics.controller.js';

const analyticsRouter = express.Router();

// Main analytics dashboard (admin only)
analyticsRouter.get(
  '/performance', 
  isAuthenticated,
  isAdmin,
  analyticsController.getPerformanceAnalytics
);

// Blog Post Engagement Metrics (available to authenticated users)
analyticsRouter.get(
  '/engagement/:id', 
  isAuthenticated,
  analyticsController.getEngagementMetrics
);

// Content trends analysis
analyticsRouter.get(
  '/trends', 
  isAuthenticated,
  isAdmin,
  analyticsController.getContentTrends
);

// Trending Topics Route
analyticsRouter.get(
  '/trending-topics', 
  analyticsController.getTrendingTopics
);

// Recommendation insights for a specific user
analyticsRouter.get(
  '/recommendation-insights', 
  isAuthenticated,
  analyticsController.getRecommendationInsights
);

export default analyticsRouter;