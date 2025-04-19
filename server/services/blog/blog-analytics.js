import { Blog } from '../../models/blog.model.js';
import mongoose from 'mongoose';

class BlogAnalyticsService {
  /**
   * Generate comprehensive blog performance analytics
   * @returns {Promise<Object>} Blog performance analytics
   */
  static async generatePerformanceAnalytics() {
    try {
      const analytics = await Blog.aggregate([
        {
          $facet: {
            // Overall blog statistics
            overallStats: [
              {
                $group: {
                  _id: null,
                  totalBlogs: { $sum: 1 },
                  totalViews: { $sum: '$views' },
                  totalLikes: { $sum: { $size: '$likes' } },
                  totalComments: { $sum: { $size: '$comments' } }
                }
              }
            ],
            
            // Performance by category
            categoryPerformance: [
              {
                $group: {
                  _id: '$category',
                  blogCount: { $sum: 1 },
                  totalViews: { $sum: '$views' },
                  avgViews: { $avg: '$views' },
                  totalLikes: { $sum: { $size: '$likes' } }
                }
              },
              { $sort: { totalViews: -1 } }
            ],
            
            // Top performing blogs
            topBlogs: [
              { $sort: { views: -1 } },
              { $limit: 5 },
              {
                $project: {
                  title: 1,
                  views: 1,
                  likes: { $size: '$likes' },
                  comments: { $size: '$comments' },
                  category: 1
                }
              }
            ],
            
            // Author performance
            authorPerformance: [
              {
                $group: {
                  _id: '$author',
                  blogCount: { $sum: 1 },
                  totalViews: { $sum: '$views' },
                  totalLikes: { $sum: { $size: '$likes' } }
                }
              },
              { 
                $lookup: {
                  from: 'users',
                  localField: '_id',
                  foreignField: '_id',
                  as: 'authorDetails'
                }
              },
              {
                $project: {
                  username: { $arrayElemAt: ['$authorDetails.username', 0] },
                  blogCount: 1,
                  totalViews: 1,
                  totalLikes: 1
                }
              },
              { $sort: { totalViews: -1 } },
              { $limit: 10 }
            ],
            
            // Temporal analysis
            timeSeriesAnalysis: [
              {
                $group: {
                  _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                  },
                  blogCount: { $sum: 1 },
                  totalViews: { $sum: '$views' }
                }
              },
              { $sort: { '_id.year': 1, '_id.month': 1 } }
            ]
          }
        }
      ]);

      return {
        overallStats: analytics[0].overallStats[0] || {},
        categoryPerformance: analytics[0].categoryPerformance,
        topBlogs: analytics[0].topBlogs,
        authorPerformance: analytics[0].authorPerformance,
        timeSeriesAnalysis: analytics[0].timeSeriesAnalysis
      };
    } catch (error) {
      console.error('Blog analytics generation error:', error);
      throw new Error('Failed to generate blog analytics');
    }
  }

  /**
   * Calculate engagement metrics for a specific blog post
   * @param {string} blogId - Blog post ID
   * @returns {Promise<Object>} Engagement metrics
   */
  static async calculateEngagementMetrics(blogId) {
    try {
      const blogObjectId = new mongoose.Types.ObjectId(blogId);
      
      const [engagementMetrics] = await Blog.aggregate([
        { $match: { _id: blogObjectId } },
        {
          $project: {
            title: 1,
            views: 1,
            likeCount: { $size: '$likes' },
            commentCount: { $size: '$comments' },
            engagement: {
              $add: [
                { $multiply: [{ $size: '$likes' }, 5] },
                { $multiply: [{ $size: '$comments' }, 3] },
                '$views'
              ]
            },
            engagementRate: {
              $divide: [
                { $add: [
                  { $size: '$likes' },
                  { $size: '$comments' }
                ]},
                { $max: ['$views', 1] }
              ]
            },
            avgCommentLength: {
              $avg: { $map: {
                input: '$comments',
                as: 'comment',
                in: { $strLenCP: '$$comment.text' }
              }}
            },
            comments: '$comments'
          }
        },
        {
          $addFields: {
            topComments: {
              $slice: [
                { $sortArray: { 
                  input: '$comments', 
                  sortBy: { createdAt: -1 } 
                }},
                3
              ]
            }
          }
        }
      ]);

      // If no blog found, return null
      if (!engagementMetrics) {
        return null;
      }

      // Format and enhance metrics
      return {
        title: engagementMetrics.title,
        views: engagementMetrics.views,
        likeCount: engagementMetrics.likeCount,
        commentCount: engagementMetrics.commentCount,
        engagement: {
          score: engagementMetrics.engagement,
          rate: (engagementMetrics.engagementRate * 100).toFixed(2) + '%'
        },
        commentAnalytics: {
          avgCommentLength: Math.round(engagementMetrics.avgCommentLength || 0),
          topComments: engagementMetrics.topComments.map(comment => ({
            text: comment.text,
            user: comment.user,
            createdAt: comment.createdAt
          }))
        }
      };
    } catch (error) {
      console.error('Engagement metrics calculation error:', error);
      throw new Error('Failed to calculate engagement metrics');
    }
  }

  /**
   * Generate content recommendation insights
   * @param {string} userId - User ID to generate recommendations for
   * @returns {Promise<Object>} Recommendation insights
   */
  static async generateRecommendationInsights(userId) {
    try {
      const insights = await Blog.aggregate([
        { $match: { 'likes': mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: '$category',
            likedBlogCount: { $sum: 1 },
            totalViews: { $sum: '$views' }
          }
        },
        { $sort: { likedBlogCount: -1 } },
        {
          $project: {
            category: '$_id',
            likedBlogCount: 1,
            totalViews: 1,
            interestScore: { 
              $multiply: ['$likedBlogCount', { $log: { $add: ['$totalViews', 1] } }] 
            }
          }
        }
      ]);

      return {
        topInterestCategories: insights,
        recommendationProfile: insights.map(insight => ({
          category: insight.category,
          interestLevel: insight.interestScore
        }))
      };
    } catch (error) {
      console.error('Recommendation insights generation error:', error);
      throw new Error('Failed to generate recommendation insights');
    }
  }

  /**
   * Analyze content trends and patterns
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} Content trend analysis
   */
  static async analyzeContentTrends(options = {}) {
    const { 
      period = 'monthly', 
      limit = 10 
    } = options;

    try {
      const trendAnalysis = await Blog.aggregate([
        {
          $group: {
            _id: period === 'monthly' 
              ? { 
                  year: { $year: '$createdAt' }, 
                  month: { $month: '$createdAt' } 
                }
              : { year: { $year: '$createdAt' } },
            blogCount: { $sum: 1 },
            totalViews: { $sum: '$views' },
            topCategories: { 
              $addToSet: {
                category: '$category',
                count: { $sum: 1 }
              }
            },
            avgEngagement: {
              $avg: { 
                $add: [
                  { $size: '$likes' },
                  { $size: '$comments' }
                ]
              }
            }
          }
        },
        { $sort: { totalViews: -1 } },
        { $limit: limit }
      ]);

      return {
        trendPeriod: period,
        trends: trendAnalysis.map(trend => ({
          period: period === 'monthly' 
            ? `${trend._id.year}-${trend._id.month}` 
            : trend._id.year,
          blogCount: trend.blogCount,
          totalViews: trend.totalViews,
          topCategories: trend.topCategories,
          avgEngagement: trend.avgEngagement
        }))
      };
    } catch (error) {
      console.error('Content trend analysis error:', error);
      throw new Error('Failed to analyze content trends');
    }
  }
}

export default BlogAnalyticsService;