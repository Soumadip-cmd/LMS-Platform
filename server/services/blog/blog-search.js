import { Blog } from '../../models/blog.model.js';
import natural from 'natural';

class BlogSearchService {
  /**
   * Perform advanced search on blog posts
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Array>} Matching blog posts
   */
  static async advancedSearch(searchParams) {
    const {
      query = '',
      category,
      tags,
      dateRange,
      minViews,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = searchParams;

    try {
      // Build complex search query
      const searchQuery = {
        isPublished: true
      };

      // Text search using natural language processing
      if (query) {
        // Use natural language tokenization and stemming
        const tokenizer = new natural.WordTokenizer();
        const stemmer = natural.PorterStemmer;
        
        const processedTerms = tokenizer.tokenize(query)
          .map(term => stemmer.stem(term.toLowerCase()));

        // Create text search with stemmed terms
        searchQuery.$text = { 
          $search: processedTerms.join(' ') 
        };
      }

      // Category filter
      if (category) {
        searchQuery.category = category;
      }

      // Tags filter
      if (tags && tags.length > 0) {
        searchQuery.tags = { $in: tags };
      }

      // Date range filter
      if (dateRange) {
        const { start, end } = dateRange;
        searchQuery.createdAt = {};
        if (start) searchQuery.createdAt.$gte = new Date(start);
        if (end) searchQuery.createdAt.$lte = new Date(end);
      }

      // Minimum views filter
      if (minViews) {
        searchQuery.views = { $gte: minViews };
      }

      // Sorting
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Pagination
      const skip = (page - 1) * limit;

      // Perform search
      const results = await Blog.find(searchQuery)
        .populate('author', 'username profilePicture')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      // Get total count for pagination
      const totalResults = await Blog.countDocuments(searchQuery);

      return {
        results,
        totalResults,
        page,
        totalPages: Math.ceil(totalResults / limit)
      };
    } catch (error) {
      console.error('Advanced search error:', error);
      throw new Error('Search failed');
    }
  }

  /**
   * Perform semantic search using vector embeddings
   * @param {string} query - Search query
   * @param {number} limit - Number of results to return
   * @returns {Promise<Array>} Semantically matched blog posts
   */
  static async semanticSearch(query, limit = 5) {
    try {
      // This is a placeholder for semantic search
      // In a real-world scenario, you'd use:
      // 1. Pre-computed vector embeddings
      // 2. Machine learning model (e.g., Word2Vec, BERT)
      // 3. Vector database for efficient similarity search

      // Simulated semantic search using text similarity
      const results = await Blog.find({
        $text: { $search: query },
        isPublished: true
      })
      .populate('author', 'username profilePicture')
      .sort({ 
        score: { $meta: "textScore" } 
      })
      .limit(limit);

      return results;
    } catch (error) {
      console.error('Semantic search error:', error);
      return [];
    }
  }

  /**
   * Generate search suggestions
   * @param {string} query - Partial search query
   * @returns {Promise<Array>} Search suggestions
   */
  static async searchSuggestions(query) {
    if (!query || query.length < 2) return [];

    try {
      // Find suggestions based on title and tags
      const suggestions = await Blog.aggregate([
        {
          $match: {
            isPublished: true,
            $or: [
              { title: { $regex: query, $options: 'i' } },
              { tags: { $elemMatch: { $regex: query, $options: 'i' } } }
            ]
          }
        },
        {
          $project: {
            suggestion: '$title',
            type: 'title'
          }
        },
        {
          $unionWith: {
            coll: 'blogs',
            pipeline: [
              {
                $match: {
                  isPublished: true,
                  tags: { $elemMatch: { $regex: query, $options: 'i' } }
                }
              },
              {
                $unwind: '$tags'
              },
              {
                $match: {
                  tags: { $regex: query, $options: 'i' }
                }
              },
              {
                $project: {
                  suggestion: '$tags',
                  type: 'tag'
                }
              }
            ]
          }
        },
        { $limit: 10 },
        { $group: { _id: '$suggestion', types: { $addToSet: '$type' } } }
      ]);

      return suggestions.map(suggestion => ({
        text: suggestion._id,
        types: suggestion.types
      }));
    } catch (error) {
      console.error('Search suggestions error:', error);
      return [];
    }
  }
}

export default BlogSearchService;