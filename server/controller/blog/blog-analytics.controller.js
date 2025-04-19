
import BlogAnalyticsService from '../../services/blog/blog-analytics.js';

export const analyticsController = {
  // Main analytics dashboard
  getPerformanceAnalytics: async (req, res) => {
    try {
      const analytics = await BlogAnalyticsService.generatePerformanceAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching blog analytics', 
        error: error.message 
      });
    }
  },

  // Blog Post Engagement Metrics
  getEngagementMetrics: async (req, res) => {
    try {
      const engagementMetrics = await BlogAnalyticsService.calculateEngagementMetrics(req.params.id);
      if (!engagementMetrics) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      res.json(engagementMetrics);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error calculating engagement metrics', 
        error: error.message 
      });
    }
  },

  // Content trends analysis
  getContentTrends: async (req, res) => {
    try {
      const { period, limit } = req.query;
      const options = {
        period: period || 'monthly',
        limit: Number(limit) || 10
      };
      
      const trendAnalysis = await BlogAnalyticsService.analyzeContentTrends(options);
      res.json(trendAnalysis);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error analyzing content trends', 
        error: error.message 
      });
    }
  },

  // Trending Topics 
  getTrendingTopics: async (req, res) => {
    try {
      const { limit } = req.query;
      const trendingTopics = await BlogAnalyticsService.generateRecommendationInsights(limit);
      res.json(trendingTopics);
    } catch (error) {
      res.status(500).json({ 
        message: 'Trending topics retrieval failed', 
        error: error.message 
      });
    }
  },

  // Recommendation insights
  getRecommendationInsights: async (req, res) => {
    try {
      const userId = req.user._id;
      const insights = await BlogAnalyticsService.generateRecommendationInsights(userId);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error generating recommendation insights', 
        error: error.message 
      });
    }
  }
};

export default analyticsController;