import React, { useState, useEffect } from 'react';
import { Calendar, Search, ArrowRight, ArrowLeft, ArrowRight as ArrowRightIcon } from 'lucide-react';

const ResourceBlog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFeaturedPage, setCurrentFeaturedPage] = useState(0);
  const [currentBlogPage, setCurrentBlogPage] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  // Track window size for responsive pagination
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Determine items per page based on screen size
  const featuredItemsPerPage = 2;
  const getBlogItemsPerPage = () => {
    if (windowWidth >= 1024) { // lg breakpoint
      return 6;
    } else if (windowWidth >= 768) { // md breakpoint
      return 4;
    } else {
      return 6; // Default for small screens
    }
  };
  
  const blogItemsPerPage = getBlogItemsPerPage();

  // Sample blog data
  const featuredArticles = [
    {
      id: 1,
      date: '02/04/2023',
      title: 'Analytics 101: How to get started with user data analysis',
      content: 'We are thrilled to announce a major milestone in our journey together. Preplings officially out of beta! This is an exciting moment for us and we want to express our deepest gratitude for your feedback.',
      category: 'Analytics',
      image: 'https://placehold.co/600x300'
    },
    {
      id: 2,
      date: '02/04/2023',
      title: 'Unlocking the power of analytics: Key metrics and insights',
      content: 'We are thrilled to announce a major milestone in our journey together. Preplings officially out of beta! This is an exciting moment for us and we want to express our deepest gratitude for your feedback.',
      category: 'Insights',
      image: 'https://placehold.co/600x300'
    },
    {
      id: 3,
      date: '02/04/2023',
      title: 'Building effective data dashboards for your team',
      content: 'We are thrilled to announce a major milestone in our journey together. Preplings officially out of beta! This is an exciting moment for us and we want to express our deepest gratitude for your feedback.',
      category: 'Analytics',
      image: 'https://placehold.co/600x300'
    },
    {
      id: 4,
      date: '02/04/2023',
      title: 'User research methods that drive product growth',
      content: 'We are thrilled to announce a major milestone in our journey together. Preplings officially out of beta! This is an exciting moment for us and we want to express our deepest gratitude for your feedback.',
      category: 'Research',
      image: 'https://placehold.co/600x300'
    }
  ];

  const allBlogPosts = [
    {
      id: 1,
      date: '02/04/2023',
      title: 'Analytics 101: How to get started with user data analysis',
      category: 'Analytics',
      image: 'https://placehold.co/400x200'
    },
    {
      id: 2,
      date: '02/04/2023',
      title: 'Analytics 101: How to get started with user data analysis',
      category: 'Analytics',
      image: 'https://placehold.co/400x200'
    },
    {
      id: 3,
      date: '02/04/2023',
      title: 'Analytics 101: How to get started with user data analysis',
      category: 'Analytics',
      image: 'https://placehold.co/400x200'
    },
    {
      id: 4,
      date: '02/04/2023',
      title: 'Analytics 101: How to get started with user data analysis',
      category: 'Reports',
      image: 'https://placehold.co/400x200'
    },
    {
      id: 5,
      date: '02/04/2023',
      title: 'Analytics 101: How to get started with user data analysis',
      category: 'Insights',
      image: 'https://placehold.co/400x200'
    },
    {
      id: 6,
      date: '02/04/2023',
      title: 'Analytics 101: How to get started with user data analysis',
      category: 'Updates',
      image: 'https://placehold.co/400x200'
    },
    {
      id: 7,
      date: '02/04/2023',
      title: 'Data visualization best practices',
      category: 'Analytics',
      image: 'https://placehold.co/400x200'
    },
    {
      id: 8,
      date: '02/04/2023',
      title: 'Creating effective user surveys',
      category: 'Research',
      image: 'https://placehold.co/400x200'
    },
    {
      id: 9,
      date: '02/04/2023',
      title: 'Understanding customer journeys',
      category: 'Insights',
      image: 'https://placehold.co/400x200'
    }
  ];

  // Filter posts based on search
  const filteredPosts = allBlogPosts.filter(post => {
    return post.title.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Calculate total pages
  const totalFeaturedPages = Math.ceil(featuredArticles.length / featuredItemsPerPage);
  const totalBlogPages = Math.ceil(filteredPosts.length / blogItemsPerPage);
  
  // Reset current page when items per page changes
  useEffect(() => {
    if (currentBlogPage >= totalBlogPages && totalBlogPages > 0) {
      setCurrentBlogPage(totalBlogPages - 1);
    }
  }, [windowWidth, totalBlogPages, currentBlogPage]);
  
  // Get current page items
  const currentFeaturedArticles = featuredArticles.slice(
    currentFeaturedPage * featuredItemsPerPage,
    (currentFeaturedPage + 1) * featuredItemsPerPage
  );
  
  const currentBlogPosts = filteredPosts.slice(
    currentBlogPage * blogItemsPerPage,
    (currentBlogPage + 1) * blogItemsPerPage
  );
  
  // Navigation handlers
  const goToPrevFeatured = () => {
    setCurrentFeaturedPage(prev => (prev === 0 ? totalFeaturedPages - 1 : prev - 1));
  };
  
  const goToNextFeatured = () => {
    setCurrentFeaturedPage(prev => (prev === totalFeaturedPages - 1 ? 0 : prev + 1));
  };
  
  const goToPrevBlog = () => {
    setCurrentBlogPage(prev => (prev === 0 ? totalBlogPages - 1 : prev - 1));
  };
  
  const goToNextBlog = () => {
    setCurrentBlogPage(prev => (prev === totalBlogPages - 1 ? 0 : prev + 1));
  };

  // Enhanced NavigationButton component with updated responsiveness for mobile
  const NavigationButton = ({ onClick, disabled, direction, label }) => (
    <button 
      className={`relative group flex items-center justify-center 
        w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
        ${disabled 
          ? 'bg-gray-100 cursor-not-allowed' 
          : 'border border-[#1976D2] text-[#1976D2] rounded-full hover:bg-blue-50 transition-all duration-300 transform active:scale-95'
        }`}
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
    >
      {direction === 'prev' ? (
        <ArrowLeft 
          size={windowWidth < 640 ? 16 : windowWidth < 768 ? 18 : 22} 
          className={`${disabled ? 'text-gray-300' : 'text-[#1976D2]'} transition-colors duration-300`} 
        />
      ) : (
        <ArrowRight 
          size={windowWidth < 640 ? 16 : windowWidth < 768 ? 18 : 22} 
          className={`${disabled ? 'text-gray-300' : 'text-[#1976D2]'} transition-colors duration-300`} 
        />
      )}
    </button>
  );

  // Pagination Display component with responsive adjustments
  const PaginationDisplay = ({ current, total }) => (
    <div className="flex items-center px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 mx-1 sm:mx-2 bg-white rounded-lg shadow-sm border border-blue-50">
      <span className="text-xs sm:text-sm font-medium text-blue-600">{current + 1}</span>
      <span className="text-gray-400 mx-1">/</span>
      <span className="text-xs sm:text-sm text-gray-500">{total}</span>
    </div>
  );

  // Featured article card component with improved shadow
  const FeaturedArticleCard = ({ article }) => (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="h-48 bg-gray-100 overflow-hidden">
        <img 
          src={article.image || "https://placehold.co/600x300"} 
          alt="Featured article" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <Calendar size={16} className="mr-1" />
          <span>{article.date}</span>
        </div>
        <h2 className="text-lg font-semibold text-blue-600 mb-2">{article.title}</h2>
        <p className="text-gray-600 text-sm mb-4">{article.content}</p>
        <button className="text-blue-600 text-sm font-medium hover:underline flex items-center group">
          See More
          <ArrowRightIcon size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );

  // Blog post card component with improved shadow
  const BlogPostCard = ({ post }) => (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="h-40 bg-gray-100 overflow-hidden">
        <img 
          src={post.image || "https://placehold.co/400x200"} 
          alt="Blog post" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center text-gray-500 text-sm mb-1">
          <Calendar size={16} className="mr-1" />
          <span>{post.date}</span>
        </div>
        <h3 className="text-sm font-medium text-blue-600">{post.title}</h3>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 mx-2 lg:mx-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl 2xl:mx-auto">
        {/* Blog Header */}
        <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="mb-4 p-6 md:mb-0">
            <div className="flex items-center mb-2">
            <img 
              src={`${process.env.PUBLIC_URL}/assets/Resources/pencil-blog.png`} 
              alt="Blog header decoration" 
              className="size-10 mr-1"
            />
              <h1 className="text-xl md:text-2xl xl:text-3xl font-semibold">Our Little Blog</h1>
            </div>
            <p className="text-gray-600 mt-4 md:text-lg text-sm">
              Uncover the latest in community support news and discoveries.
            </p>
          </div>
          <div>
            <img 
              src={`${process.env.PUBLIC_URL}/assets/Resources/blog.png`} 
              alt="Blog header decoration" 
              className="hidden md:block md:h-48 w-full md:w-auto"
            />
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <div className="flex w-full">
            <div className="relative w-full max-w-3xl mx-auto">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 border border-gray-300 focus:ring-blue-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Featured Articles */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl xl:text-2xl font-semibold">Featured Articles</h2>
            <div className="flex items-center">
              <NavigationButton 
                onClick={goToPrevFeatured}
                direction="prev"
                label="Previous featured articles"
              />
              <PaginationDisplay current={currentFeaturedPage} total={totalFeaturedPages} />
              <NavigationButton 
                onClick={goToNextFeatured}
                direction="next"
                label="Next featured articles"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {currentFeaturedArticles.map((article) => (
              <FeaturedArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* All Blog Posts */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl xl:text-2xl font-semibold">All Blog Posts</h2>
            <div className="flex items-center">
              <NavigationButton 
                onClick={goToPrevBlog}
                disabled={totalBlogPages <= 1}
                direction="prev"
                label="Previous blog posts"
              />
              <PaginationDisplay current={currentBlogPage} total={totalBlogPages} />
              <NavigationButton 
                onClick={goToNextBlog}
                disabled={totalBlogPages <= 1}
                direction="next"
                label="Next blog posts"
              />
            </div>
          </div>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow-lg">
              <p className="text-gray-500">No blog posts found matching your criteria.</p>
              <button 
                className="mt-4 text-blue-600 hover:underline"
                onClick={() => {
                  setSearchQuery('');
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentBlogPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceBlog;