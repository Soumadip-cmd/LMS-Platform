import {
    GET_BLOGS,
    GET_BLOG,
    GET_POPULAR_BLOGS,
    GET_RELATED_BLOGS,
    CREATE_BLOG,
    UPDATE_BLOG,
    DELETE_BLOG,
    BLOG_ERROR,
    CLEAR_BLOG_ERROR,
    SET_LOADING,
    CLEAR_BLOG,
    ADD_COMMENT,
    TOGGLE_LIKE,
    GET_BLOG_ANALYTICS,
    GET_TRENDING_TOPICS,
    GET_RECOMMENDATIONS,
    SET_SEARCH_RESULTS,
    CLEAR_SEARCH_RESULTS
  } from '../types.js';

  const blogReducer = (state, action) => {
    switch (action.type) {
      case SET_LOADING:
        return {
          ...state,
          loading: true,
          // Set tracking flags from payload or preserve existing ones
          _lastRequestedBlogId: action.payload?._lastRequestedBlogId || state._lastRequestedBlogId,
          _lastRequestedPopularBlogs: action.payload?._lastRequestedPopularBlogs || state._lastRequestedPopularBlogs
        };

      case GET_BLOGS:
        return {
          ...state,
          blogs: action.payload.blogs,
          popularBlogs: action.payload.popularBlogs,
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          loading: false
        };

      case GET_BLOG:
        return {
          ...state,
          blog: action.payload,
          loading: false,
          // Reset the blog ID flag since we've loaded the blog
          _lastRequestedBlogId: null
        };

      case GET_POPULAR_BLOGS:
        return {
          ...state,
          popularBlogs: action.payload,
          loading: false,
          // Reset the popular blogs flag since we've loaded them
          _lastRequestedPopularBlogs: false
        };

      case GET_RELATED_BLOGS:
        return {
          ...state,
          relatedBlogs: action.payload,
          loading: false
        };

      case CREATE_BLOG:
        return {
          ...state,
          blogs: [action.payload, ...state.blogs],
          loading: false
        };

      case UPDATE_BLOG:
        return {
          ...state,
          blogs: state.blogs.map(blog =>
            blog._id === action.payload._id ? action.payload : blog
          ),
          blog: action.payload,
          loading: false
        };

      case DELETE_BLOG:
        return {
          ...state,
          blogs: state.blogs.filter(blog => blog._id !== action.payload),
          loading: false
        };

      case ADD_COMMENT:
        return {
          ...state,
          blog: {
            ...state.blog,
            comments: [action.payload, ...state.blog.comments]
          }
        };

      case TOGGLE_LIKE:
        return {
          ...state,
          blog: {
            ...state.blog,
            likes: state.blog.likes.length !== action.payload.likes ?
              (action.payload.message === 'Liked' ?
                [...state.blog.likes, 'temp-id'] :
                state.blog.likes.filter((_, index) => index !== state.blog.likes.length - 1)
              ) :
              state.blog.likes
          }
        };

      case GET_BLOG_ANALYTICS:
        return {
          ...state,
          analytics: action.payload,
          loading: false
        };

      case GET_TRENDING_TOPICS:
        return {
          ...state,
          trendingTopics: action.payload,
          loading: false
        };

      case GET_RECOMMENDATIONS:
        return {
          ...state,
          recommendations: action.payload,
          loading: false
        };

      case SET_SEARCH_RESULTS:
        return {
          ...state,
          searchResults: action.payload,
          loading: false
        };

      case CLEAR_SEARCH_RESULTS:
        return {
          ...state,
          searchResults: null
        };

      case CLEAR_BLOG:
        return {
          ...state,
          blog: null,
          relatedBlogs: [],
          _lastRequestedBlogId: null,
          _lastRequestedPopularBlogs: false
        };

      case BLOG_ERROR:
        return {
          ...state,
          error: action.payload,
          loading: false,
          // Reset the tracking flags on error
          _lastRequestedBlogId: null,
          _lastRequestedPopularBlogs: false
        };

      case CLEAR_BLOG_ERROR:
        return {
          ...state,
          error: null
        };

      default:
        return state;
    }
  };

  export default blogReducer;