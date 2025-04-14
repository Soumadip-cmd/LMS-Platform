import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

const GeneralPracticeReading = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(21);

  // Mock data for reading exercises
  const exercises = [
    {
      id: 1,
      title: "Practice Reading Test 1",
      level: "Goethe A1 Level",
      status: "Completed",
      timeRange: "20-25 minutes",
      rating: "4.8/5",
      ratings: 124,
      progress: 95,
    },
    {
      id: 2,
      title: "Practice Reading Test 2",
      level: "Goethe A1 Level",
      status: "In Progress",
      timeRange: "25-30 minutes",
      rating: "4.6/5",
      ratings: 98,
      progress: 55,
    },
    {
      id: 3,
      title: "Practice Reading Test 3",
      level: "Goethe A1 Level",
      status: "Not started yet",
      timeRange: "30-35 minutes",
      rating: "4.9/5",
      ratings: 156,
      progress: 0,
    },
    {
      id: 4,
      title: "Practice Reading Test 4",
      level: "Goethe A1 Level",
      status: "Not started yet",
      timeRange: "25-30 minutes",
      rating: "4.7/5",
      ratings: 112,
      progress: 0,
    },
    {
      id: 5,
      title: "Practice Reading Test 5",
      level: "Goethe A1 Level",
      status: "Not started yet",
      timeRange: "35-40 minutes",
      rating: "4.8/5",
      ratings: 132,
      progress: 0,
    },
  ];

  // Pagination functionality
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Dynamic pagination rendering function
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5; // Number of visible page buttons (excluding ellipsis and edge buttons)

    // Always show first page
    buttons.push(
      <button
        key={1}
        className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-sm sm:text-base ${
          currentPage === 1 ? "bg-blue-600 text-white" : "text-gray-600"
        }`}
        onClick={() => handlePageChange(1)}
      >
        1
      </button>
    );

    // Calculate the range of visible page numbers
    let startPage, endPage;

    if (currentPage <= 3) {
      // Current page is near the beginning
      startPage = 2;
      endPage = Math.min(5, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      // Current page is near the end
      startPage = Math.max(totalPages - 4, 2);
      endPage = totalPages - 1;
    } else {
      // Current page is in the middle
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }

    // Add first ellipsis if needed
    if (startPage > 2) {
      buttons.push(
        <span key="ellipsis1" className="text-center w-6">
          ...
        </span>
      );
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-sm sm:text-base ${
            currentPage === i ? "bg-blue-600 text-white" : "text-gray-600"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Add last ellipsis if needed
    if (endPage < totalPages - 1) {
      buttons.push(
        <span key="ellipsis2" className="text-center w-6">
          ...
        </span>
      );
    }

    // Always show last page if we have more than 1 page
    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages}
          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-sm sm:text-base ${
            currentPage === totalPages
              ? "bg-blue-600 text-white"
              : "text-gray-600"
          }`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  // Function to determine button appearance based on status
  const getButtonStyle = (status) => {
    // Common button class with fixed width
    const buttonClass = "w-40 xl:w-52 text-white py-2 rounded-xl font-medium text-center text-sm sm:text-base lg:text-lg";
    
    switch (status) {
      case "Completed":
        return (
          <button className={`${buttonClass}   bg-black`}>
            Restart?
          </button>
        );
      case "In Progress":
        return (
          <button className={`${buttonClass} bg-[#FFB71C]`}>
            Continue
          </button>
        );
      default:
        return (
          <button className={`${buttonClass} bg-blue-500`}>
            Start Exercise
          </button>
        );
    }
  };

  // Function to determine status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <span className="px-4 py-1 rounded-md text-xs sm:text-sm md:text-base bg-[#00AB5B] text-white">
            {status}
          </span>
        );
      case "In Progress":
        return (
          <span className="px-4 py-1 rounded-md text-xs sm:text-sm md:text-base bg-[#FFB71C] text-white">
            {status}
          </span>
        );
      default:
        return (
          <span className="px-4 py-1 rounded-md text-xs sm:text-sm md:text-base bg-gray-300 text-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="m-2 lg:mx-4 xl:mx-12 px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 mb-3">
          Practice Reading - Improve Your Comprehension
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600">
          10 curated reading exercises per set to enhance your understanding and
          speed
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-8 flex items-center">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-600 mr-3"
          >
            <path d="M12 16v5" />
            <path d="M16 14v7" />
            <path d="M20 10v11" />
            <path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" />
            <path d="M4 18v3" />
            <path d="M8 14v7" />
          </svg>
          <span className="text-sm sm:text-base md:text-lg text-gray-600">
            You have completed 3 out of 10 sets
          </span>
        </div>
      </div>

      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          className="bg-white p-6 rounded-lg mb-4 shadow-sm border border-[#9D9D9D]"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="mb-4 md:mb-0 md:w-1/4">
              <h3 className="text-lg md:text-base lg:text-xl xl:text-2xl font-semibold">{exercise.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs sm:text-sm md:text-base text-gray-600">{exercise.level}</span>
              </div>
              <div className="mt-2">{getStatusBadge(exercise.status)}</div>
            </div>

            <div className="md:w-1/5">
              <div className="flex items-center text-gray-500">
                <Clock size={18} className="mr-2" />
                <span className="text-xs sm:text-sm md:text-base">{exercise.timeRange}</span>
              </div>

              <div className="flex items-center text-gray-500 mt-2">
                <span className="text-yellow-500 mr-2 text-lg sm:text-xl">★</span>
                <span className="text-xs sm:text-sm md:text-base">
                  {exercise.rating} ({exercise.ratings} ratings)
                </span>
              </div>
            </div>
            <div className="flex-1 h-4 bg-gray-200 rounded-full">
              <div
                className="h-4 bg-blue-500 rounded-full"
                style={{ width: `${exercise.progress}%` }}
              ></div>
            </div>

            <div className="md:w-auto md:ml-6">
              {getButtonStyle(exercise.status)}
            </div>
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="px-2 mt-8">
        <div className="flex justify-between items-center text-xs sm:text-sm md:text-base w-full text-gray-600">
          <div className="hidden lg:block text-left pr-2">
            Showing 1 to 10 of 97 results
          </div>
          <div className="w-full lg:w-auto flex items-center justify-center lg:justify-end space-x-2">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 cursor-pointer p-[1px]"
              onClick={goToPrevious}
              disabled={currentPage === 1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
            </button>

            {renderPaginationButtons()}

            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 cursor-pointer p-[1px]"
              onClick={goToNext}
              disabled={currentPage === totalPages}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralPracticeReading;