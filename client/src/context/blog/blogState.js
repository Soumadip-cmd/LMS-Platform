import React, { useReducer } from 'react';
import axios from 'axios';
import BlogContext from './blogContext.js';
import blogReducer from './blogReducer.js';
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
    error: null
  };

  const [state, dispatch] = useReducer(blogReducer, initialState);

  // Set loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  // Clear errors
  const clearErrors = () => dispatch({ type: CLEAR_BLOG_ERROR });
  const BASE_URL = 'http://localhost:8000/api/v1';
  // Get all blogs
  const getBlogs = async (page = 1, limit = 10, category = '', tag = '', search = '') => {
    setLoading();
    
    try {
      const res = await axios.get(`${BASE_URL}/blog/get-all?page=${page}&limit=${limit}${category ? `&category=${category}` : ''}${tag ? `&tag=${tag}` : ''}${search ? `&search=${search}` : ''}`);
      
      dispatch({
        type: GET_BLOGS,
        payload: {
          blogs: res.data.blogs,
          popularBlogs: res.data.popularBlogs,
          currentPage: parseInt(res.data.currentPage),
          totalPages: res.data.totalPages
        }
      });
    } catch (err) {
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Error fetching blogs'
      });
    }
  };

  // Get popular blogs
  const getPopularBlogs = async (limit = 5) => {
    setLoading();
    
    try {
      const res = await axios.get(`${BASE_URL}/blog/popular?limit=${limit}`);
      
      dispatch({
        type: GET_POPULAR_BLOGS,
        payload: res.data.popularPosts
      });
    } catch (err) {
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Error fetching popular blogs'
      });
    }
  };

  // Get a single blog
  const getBlog = async (id) => {
    setLoading();
    
    try {
      const res = await axios.get(`${BASE_URL}/blog/get/${id}`);
      
      dispatch({
        type: GET_BLOG,
        payload: res.data.blog
      });
      
      dispatch({
        type: GET_RELATED_BLOGS,
        payload: res.data.relatedPosts
      });
    } catch (err) {
      dispatch({
        type: BLOG_ERROR,
        payload: err.response?.data?.message || 'Error fetching blog'
      });
    }
  };

  // Create a new blog
  const createBlog = async (formData) => {
    setLoading();
    
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    try {
      const res = await axios.post(`${BASE_URL}/blog/create`, formData, config);
      
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
    
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    try {
      const res = await axios.put(`${BASE_URL}/blog/update/${id}`, formData, config);
      
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
      await axios.delete(`${BASE_URL}/blog/delete/${id}`);
      
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

  // Add a comment
  const addComment = async (blogId, text) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    try {
      const res = await axios.post(`${BASE_URL}/blog/${blogId}/comments`, { text }, config);
      
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

  // Toggle like
  const toggleLike = async (blogId) => {
    try {
      const res = await axios.post(`${BASE_URL}/blog/${blogId}/like`);
      
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

  // Get blog analytics
  const getBlogAnalytics = async () => {
    setLoading();
    
    try {
      const res = await axios.get(`${BASE_URL}/blog/analytics/performance`);
      
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
      const res = await axios.get(`${BASE_URL}/blog/analytics/trending-topics`);
      
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
      const res = await axios.get(`${BASE_URL}/blog/search/recommendations`);
      
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
      // Build query string from search params
      const queryParams = new URLSearchParams();
      
      for (const [key, value] of Object.entries(searchParams)) {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      }
      
      const res = await axios.get(`${BASE_URL}/blog/search/advanced?${queryParams.toString()}`);
      
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
        clearErrors
      }}
    >
      {props.children}
    </BlogContext.Provider>
  );
};
export default BlogState;