import React from 'react';
import TagStyle from '../../components/TagStyle/TagStyle';

const NewsCard = ({ date, views, title, excerpt, category }) => {
  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-lg shadow-sm  transition-all duration-300 hover:shadow-md hover:scale-105 hover:border-gray-300">
      <div className="relative mb-4 overflow-hidden rounded-md">
        <img 
          src="https://placehold.co/400x220" 
          alt="Person studying" 
          className="w-full h-48 object-cover transition-transform duration-300 hover:transform hover:scale-110"
        />
        {category === "BUSINESS" && (
          <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 font-medium">
            BUSINESS
          </span>
        )}
      </div>
      <section className="px-2 py-2">
      <div className="flex items-center justify-between text-gray-500 text-sm mb-2">
        <span className="flex items-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {date}
        </span>
        <span className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {views} views
        </span>
      </div>
      <h2 className="text-lg md:text-base font-bold mb-2">{title}</h2>
      <p className="text-gray-600 text-sm mb-4 flex-grow">{excerpt}</p>
      <button className="bg-[#D9D9D9] text-blue-500 px-4 py-2 rounded w-max text-sm font-semibold">
        Read More
      </button>
      </section>
    </div>
  );
};

const PreplingsNews = () => {
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
            <TagStyle color="#000000" text="News"/>
          </h1>
        </div>
        <p className="text-gray-600 mt-1">From Preplings to the World</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map(article => (
          <NewsCard
            key={article.id}
            date={article.date}
            views={article.views}
            title={article.title}
            excerpt={article.excerpt}
            category={article.category}
          />
        ))}
      </div>
    </div>
  );
};

export default PreplingsNews;