

import React from 'react';
import { useContext, useEffect } from 'react';
import TagStyle from '../../components/TagStyle/TagStyle';
import BlogContext from '../../context/blog/blogContext';

const NewsCard = ({ date, views, title, excerpt, category, featuredImage }) => {
  // Function to wrap numbers in date with span
  const formatDate = (dateStr) => {
    return dateStr.replace(/(\d+)/g, '<span class="numbers">$1</span>');
  };

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 hover:border-gray-300">
      <div className="relative mb-4 overflow-hidden rounded-t-lg">
        <img 
          src={featuredImage || "https://placehold.co/400x220"} 
          alt={title} 
          className="w-full h-48 object-cover transition-transform duration-300 hover:transform hover:scale-110"
        />
        {category && (
          <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 font-medium">
            {category}
          </span>
        )}
      </div>
      <div className="px-4 py-2 flex flex-col flex-grow">
        <div className="flex items-center justify-between text-gray-500 text-sm mb-2">
          <span className="flex items-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span dangerouslySetInnerHTML={{ __html: formatDate(date) }}></span>
          </span>
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="numbers">{views}</span> views
          </span>
        </div>
        <h2 className="text-lg md:text-base font-bold mb-2 line-clamp-2">{title}</h2>
        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{excerpt}</p>
        <div className="mt-auto">
          <button className="bg-[#D9D9D9] text-blue-500 px-4 py-2 rounded w-max text-sm font-semibold">
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};

const BlogNews = () => {
  // Get blog context
  const blogContext = useContext(BlogContext);
  const { blogs, getBlogs, loading } = blogContext;

  // Load blogs when component mounts
  useEffect(() => {
    getBlogs();
    // eslint-disable-next-line
  }, []);

  // Fallback to static content if blogs not loaded yet
  const articles = [
    {
      id: 1,
      date: "August 11, 2023",
      views: "2,222",
      title: "4 Learning Management System Design Tips For Better eLearning",
      excerpt: "We're obsessed with data these days, and for good reason...",
      category: ""
    },
    {
      id: 2,
      date: "August 11, 2023",
      views: "2,222",
      title: "4 Learning Management System Design Tips For Better eLearning",
      excerpt: "We're obsessed with data these days, and for good reason...",
      category: "BUSINESS"
    },
    {
      id: 3,
      date: "August 11, 2023",
      views: "2,222",
      title: "4 Learning Management System Design Tips For Better eLearning",
      excerpt: "We're obsessed with data these days, and for good reason...",
      category: ""
    },
    {
      id: 4,
      date: "August 11, 2023",
      views: "2,222",
      title: "4 Learning Management System Design Tips For Better eLearning",
      excerpt: "We're obsessed with data these days, and for good reason...",
      category: ""
    }
  ];

  return (
    <div className="mx-auto 2xl:mx-1 px-4 py-8">
      <div className="mb-8">
        <div className="inline-block">
          <h1 className="text-2xl font-bold relative">
            Preplings 
            <TagStyle color="#000000" text="Blog"/>
          </h1>
        </div>
        <p className="text-gray-600 mt-1">From Preplings to the World</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Display fallback content if loading
          articles.map(article => (
            <NewsCard
              key={article.id}
              date={article.date}
              views={article.views}
              title={article.title}
              excerpt={article.excerpt}
              category={article.category}
            />
          ))
        ) : (
          // Display blog data when loaded
          blogs && blogs.length > 0 ? (
            blogs.slice(0, 8).map(blog => (
              <NewsCard
                key={blog._id}
                date={new Date(blog.createdAt).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}
                views={blog.views.toString()}
                title={blog.title}
                excerpt={blog.content.replace(/<[^>]*>/g, '').substring(0, 80) + '...'}
                category={blog.category}
                featuredImage={blog.featuredImage}
              />
            ))
          ) : (
            // If no blogs found
            <p className="col-span-4 text-center text-gray-500">No blog posts found</p>
          )
        )}
      </div>
    </div>
  );
};

export default BlogNews;