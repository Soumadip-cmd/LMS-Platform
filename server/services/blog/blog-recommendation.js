import { Blog } from '../../models/blog.model.js';
import { User } from '../../models/user.model.js';

class BlogRecommendationService {
  /**
   * Get personalized blog recommendations
   * @param {string} userId - User ID to generate recommendations for
   * @param {number} limit - Number of recommendations to return
   * @returns {Promise<Array>} Recommended blog posts
   */
  static async getPersonalizedRecommendations(userId, limit = 5) {
    try {
      // Fetch user's interests and previously liked posts
      const user = await User.findById(userId)
        .select('interests likedPosts viewedPosts');

      // Build recommendation query
      const recommendationQuery = {
        isPublished: true,
        $or: [
          // Recommend based on user's interests
          { category: { $in: user.interests || [] } },
          
          // Recommend similar to liked posts
          ...(user.likedPosts || []).map(async likedPostId => ({
            tags: { $elemMatch: { $in: await this.getPostTags(likedPostId) } }
          }))
        ]
      };

      // Fetch recommended posts
      const recommendedPosts = await Blog.find(recommendationQuery)
        .populate('author', 'username profilePicture')
        .sort({ createdAt: -1 })
        .limit(limit);

      return recommendedPosts;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }

  /**
   * Get tags for a specific blog post
   * @param {string} postId - Blog post ID
   * @returns {Promise<Array>} Tags for the blog post
   */
  static async getPostTags(postId) {
    try {
      const post = await Blog.findById(postId).select('tags');
      return post ? post.tags : [];
    } catch (error) {
      console.error('Error fetching post tags:', error);
      return [];
    }
  }

  /**
   * Generate content-based recommendations
   * @param {string} postId - Base post ID to generate recommendations from
   * @param {number} limit - Number of recommendations to return
   * @returns {Promise<Array>} Recommended blog posts
   */
  static async getContentBasedRecommendations(postId, limit = 5) {
    try {
      // Find the base post
      const basePost = await Blog.findById(postId);
      
      if (!basePost) {
        return [];
      }

      // Recommendation criteria
      const recommendationQuery = {
        _id: { $ne: postId },
        isPublished: true,
        $or: [
          { category: basePost.category },
          { tags: { $elemMatch: { $in: basePost.tags } } }
        ]
      };

      // Fetch recommended posts
      const recommendedPosts = await Blog.find(recommendationQuery)
        .populate('author', 'username profilePicture')
        .sort({ views: -1, createdAt: -1 })
        .limit(limit);

      return recommendedPosts;
    } catch (error) {
      console.error('Error generating content-based recommendations:', error);
      return [];
    }
  }

  /**
   * Analyze trending topics
   * @param {number} limit - Number of trending topics to return
   * @returns {Promise<Array>} Trending blog topics
   */
  static async getTrendingTopics(limit = 5) {
    try {
      const trendingTopics = await Blog.aggregate([
        { $match: { isPublished: true } },
        { 
          $group: { 
            _id: '$category', 
            postCount: { $sum: 1 },
            totalViews: { $sum: '$views' },
            totalLikes: { $sum: { $size: '$likes' } }
          } 
        },
        { 
          $addFields: { 
            trendingScore: { 
              $add: [
                { $multiply: ['$postCount', 0.4] },
                { $multiply: ['$totalViews', 0.3] },
                { $multiply: ['$totalLikes', 0.3] }
              ]
            } 
          } 
        },
        { $sort: { trendingScore: -1 } },
        { $limit: limit }
      ]);

      return trendingTopics;
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      return [];
    }
  }
}

export default BlogRecommendationService;