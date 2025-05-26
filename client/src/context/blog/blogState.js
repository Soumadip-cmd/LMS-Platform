import React, { useReducer } from 'react';
import axios from 'axios';
import BlogContext from './blogContext.js';
import blogReducer from './blogReducer.js';
import { SERVER_URI } from '../../utlils/ServerUri';
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
  CLEAR_SEARCH_RESULTS,
  ADD_COMMENT_REPLY,
  TOGGLE_COMMENT_LIKE,
  TOGGLE_REPLY_LIKE,
  UPDATE_COMMENT_REALTIME,
  UPDATE_REPLY_REALTIME
} from '../types.js';

const BlogState = (props) => {
  const initialState = {
    blogs: [],
    blog: null,
    popularBlogs: [],
    relatedBlogs: [],
    recommendations: [],
    searchResults: null,
    currentPage: 1,
    totalPages: 1,
    analytics: null,
    trendingTopics: [],
    loading: false,
    error: null,
    _lastRequestedBlogId: null,
    _lastRequestedPopularBlogs: false
  };

  const [state, dispatch] = useReducer(blogReducer, initialState);

  // Configure axios defaults
  axios.defaults.baseURL = SERVER_URI;
  axios.defaults.withCredentials = true;

  // Helper function to get auth config
const getAuthConfig = () => {
  const token = localStorage.getItem('authToken'); // ✅ Change from 'token' to 'authToken'
  
  // Debug logging
  console.log('🔍 BlogState Auth Debug:', {
    tokenExists: !!token,
    tokenLength: token?.length,
    tokenPreview: token?.substring(0, 20) + '...'
  });
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };
  
  console.log('🔍 Request Config:', config);
  return config;
};

  // Set loading
  const setLoading = (payload) => dispatch({ type: SET_LOADING, payload });

  // Clear errors
  const clearErrors = () => dispatch({ type: CLEAR_BLOG_ERROR });

  // Get all blogs
  const getBlogs = async (page = 1, limit = 10, category = '', tag = '', search = '') => {
    if (
      state.blogs &&
      state.blogs.length > 0 &&
      state.currentPage === page &&
      !state.loading &&
      !category &&
      !tag &&
      !search
    ) {
      console.log(`Blogs already loaded for page ${page}, skipping fetch`);
      return state.blogs;
    }

    setLoading();

    try {
      console.log(`Fetching blogs: page=${page}, limit=${limit}, category=${category}, tag=${tag}, search=${search}`);
      const res = await axios.get(`/blog/get-all?page=${page}&limit=${limit}${category ? `&category=${category}` : ''}${tag ? `&tag=${tag}` : ''}${search ? `&search=${search}` : ''}`);
      console.log(`Received ${res.data.blogs.length} blogs`);

      dispatch({
        type: GET_BLOGS,
        payload: {
          blogs: res.data.blogs,
          popularBlogs: res.data.popularBlogs,
          currentPage: parseInt(res.data.currentPage),
          totalPages: res.data.totalPages
        }
      });

      return res.data.blogs;
    } catch (err) {
      console.error("Error fetching blogs:", err);
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Error fetching blogs'
      });
    }
  };

  // Get popular blogs
  const getPopularBlogs = async (limit = 5) => {
    if (state.popularBlogs && state.popularBlogs.length >= limit && !state.loading) {
      console.log(`Popular blogs already loaded (${state.popularBlogs.length}), skipping fetch`);
      return state.popularBlogs;
    }

    if (state.loading && state._lastRequestedPopularBlogs) {
      console.log(`Already loading popular blogs, skipping duplicate fetch`);
      return null;
    }

    setLoading({ _lastRequestedPopularBlogs: true });

    try {
      console.log(`Fetching popular blogs with limit: ${limit}`);
      const res = await axios.get(`/blog/popular?limit=${limit}`);

      if (!res.data || !res.data.popularPosts) {
        console.error("Invalid response from server:", res.data);
        dispatch({
          type: BLOG_ERROR,
          payload: 'Invalid response from server'
        });
        return null;
      }

      console.log("Popular blogs received:", res.data.popularPosts.length);

      dispatch({
        type: GET_POPULAR_BLOGS,
        payload: res.data.popularPosts
      });

      return res.data.popularPosts;
    } catch (err) {
      console.error("Error fetching popular blogs:", err);
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Error fetching popular blogs'
      });
      return null;
    }
  };

  // Get a single blog
  const getBlog = async (id) => {
    if (!id) {
      console.error("getBlog called with invalid ID:", id);
      dispatch({
        type: BLOG_ERROR,
        payload: 'Invalid blog ID'
      });
      return null;
    }

    if (state.blog && state.blog._id === id && !state.loading) {
      console.log(`Blog with ID ${id} already loaded, skipping fetch`);
      return state.blog;
    }

    if (state.loading && state._lastRequestedBlogId === id) {
      console.log(`Already loading blog with ID ${id}, skipping duplicate fetch`);
      return null;
    }

    dispatch({
      type: SET_LOADING,
      payload: { _lastRequestedBlogId: id }
    });

    try {
      console.log(`Fetching blog with ID: ${id}`);
      const res = await axios.get(`/blog/get/${id}`);

      if (!res.data || !res.data.blog) {
        console.error("Invalid response from server:", res.data);
        dispatch({
          type: BLOG_ERROR,
          payload: 'Invalid response from server'
        });
        return null;
      }

      console.log("Blog data received:", res.data.blog.title);

      dispatch({
        type: GET_BLOG,
        payload: res.data.blog
      });

      if (res.data.relatedPosts) {
        dispatch({
          type: GET_RELATED_BLOGS,
          payload: res.data.relatedPosts
        });
      }

      return res.data.blog;
    } catch (err) {
      console.error("Error fetching blog:", err);
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Error fetching blog'
      });
      throw err;
    }
  };

  // Add a comment
  const addComment = async (blogId, text) => {
    try {
      const config = getAuthConfig(); // ✅ Use auth config
      const res = await axios.post(`/blog/${blogId}/comments`, { text }, config);

      dispatch({
        type: ADD_COMMENT,
        payload: res.data.comment
      });

      return res.data.comment;
    } catch (err) {
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Error adding comment'
      });
      throw err;
    }
  };

  // Add comment reply
  const addCommentReply = async (blogId, commentId, text) => {
    try {
      const config = getAuthConfig(); // ✅ Use auth config
      const res = await axios.post(`/blog/${blogId}/comments/${commentId}/reply`, { text }, config);

      dispatch({
        type: ADD_COMMENT_REPLY,
        payload: { commentId, reply: res.data.reply }
      });

      return res.data.reply;
    } catch (err) {
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Error adding reply'
      });
      throw err;
    }
  };

  // Toggle comment like
  const toggleCommentLike = async (blogId, commentId) => {
    try {
      const config = getAuthConfig(); // ✅ Use auth config
      const res = await axios.post(`/blog/${blogId}/comments/${commentId}/like`, {}, config);

      dispatch({
        type: TOGGLE_COMMENT_LIKE,
        payload: { commentId, likes: res.data.likes }
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Error processing comment like'
      });
      throw err;
    }
  };

  // Toggle reply like
  const toggleReplyLike = async (blogId, commentId, replyId) => {
    try {
      const config = getAuthConfig(); // ✅ Use auth config
      const res = await axios.post(`/blog/${blogId}/comments/${commentId}/replies/${replyId}/like`, {}, config);

      dispatch({
        type: TOGGLE_REPLY_LIKE,
        payload: { commentId, replyId, likes: res.data.likes }
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Error processing reply like'
      });
      throw err;
    }
  };

  // Toggle blog like
  const toggleLike = async (blogId) => {
    try {
      const config = getAuthConfig(); // ✅ Use auth config
      const res = await axios.post(`/blog/${blogId}/like`, {}, config);

      dispatch({
        type: TOGGLE_LIKE,
        payload: {
          message: res.data.message,
          likes: res.data.likes
        }
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Error processing like'
      });
      throw err;
    }
  };

  // Create a new blog
  const createBlog = async (formData) => {
    setLoading();

    try {
      const config = getAuthConfig(); // ✅ Use auth config
      const res = await axios.post(`/blog/create`, formData, config);

      dispatch({
        type: CREATE_BLOG,
        payload: res.data.blog
      });

      return res.data.blog;
    } catch (err) {
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Error creating blog'
      });
      throw err;
    }
  };

  // Update a blog
  const updateBlog = async (id, formData) => {
    setLoading();

    try {
      const config = getAuthConfig(); // ✅ Use auth config
      const res = await axios.put(`/blog/update/${id}`, formData, config);

      dispatch({
        type: UPDATE_BLOG,
        payload: res.data.blog
      });

      return res.data.blog;
    } catch (err) {
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Error updating blog'
      });
      throw err;
    }
  };

  // Delete a blog
  const deleteBlog = async (id) => {
    setLoading();

    try {
      const config = getAuthConfig(); // ✅ Use auth config
      await axios.delete(`/blog/delete/${id}`, config);

      dispatch({
        type: DELETE_BLOG,
        payload: id
      });
    } catch (err) {
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Error deleting blog'
      });
    }
  };

  // Get blog analytics
  const getBlogAnalytics = async () => {
    setLoading();

    try {
      const config = getAuthConfig(); // ✅ Use auth config
      const res = await axios.get(`/blog/analytics/performance`, config);

      dispatch({
        type: GET_BLOG_ANALYTICS,
        payload: res.data
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Error fetching analytics'
      });
      throw err;
    }
  };

  // Get trending topics
  const getTrendingTopics = async () => {
    try {
      const res = await axios.get(`/blog/analytics/trending-topics`);

      dispatch({
        type: GET_TRENDING_TOPICS,
        payload: res.data
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Error fetching trending topics'
      });
      throw err;
    }
  };

  // Get personalized recommendations
  const getRecommendations = async () => {
    try {
      const config = getAuthConfig(); // ✅ Use auth config
      const res = await axios.get(`/blog/search/recommendations`, config);

      dispatch({
        type: GET_RECOMMENDATIONS,
        payload: res.data
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Error fetching recommendations'
      });
      throw err;
    }
  };

  // Advanced search
  const advancedSearch = async (searchParams) => {
    setLoading();

    try {
      const queryParams = new URLSearchParams();

      for (const [key, value] of Object.entries(searchParams)) {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      }

      const res = await axios.get(`/blog/search/advanced?${queryParams.toString()}`);

      dispatch({
        type: SET_SEARCH_RESULTS,
        payload: res.data
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Error performing search'
      });
      throw err;
    }
  };

  // Clear search results
  const clearSearchResults = () => {
    dispatch({ type: CLEAR_SEARCH_RESULTS });
  };

  // Clear current blog
  const clearBlog = () => {
    console.log("Clearing current blog data");
    state._lastRequestedBlogId = null;
    state._lastRequestedPopularBlogs = false;
    dispatch({ type: CLEAR_BLOG });
  };

  return (
    <BlogContext.Provider
      value={{
        blogs: state.blogs,
        blog: state.blog,
        popularBlogs: state.popularBlogs,
        relatedBlogs: state.relatedBlogs,
        recommendations: state.recommendations,
        searchResults: state.searchResults,
        currentPage: state.currentPage,
        totalPages: state.totalPages,
        analytics: state.analytics,
        trendingTopics: state.trendingTopics,
        loading: state.loading,
        error: state.error,
        getBlogs,
        getBlog,
        getPopularBlogs,
        createBlog,
        updateBlog,
        deleteBlog,
        addComment,
        toggleLike,
        getBlogAnalytics,
        getTrendingTopics,
        getRecommendations,
        advancedSearch,
        clearSearchResults,
        clearBlog,
        clearErrors,
        addCommentReply,
        toggleCommentLike,
        toggleReplyLike,
      }}
    >
      {props.children}
    </BlogContext.Provider>
  );
};

export default BlogState;