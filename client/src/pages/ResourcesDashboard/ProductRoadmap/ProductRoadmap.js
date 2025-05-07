import React, { useState } from "react";
import { Heart } from "lucide-react";

const ProductRoadmap = () => {
  // State for active filter
  const [activeFilter, setActiveFilter] = useState("All");

  // Sample roadmap items data
  const roadmapItems = [
    {
      id: 1,
      title: "Native booking system and chat system",
      description:
        "A built-in booking system for tours and hotels with much more customizable products (tours) or any other service (appointment service) for example needs block times and much more complicated models",
      status: "In Beta",
      likes: 1,
    },
    {
      id: 2,
      title: "Native booking system and chat system",
      description:
        "A built-in booking system for tours and hotels with much more customizable products (tours) or any other service (appointment service) for example needs block times and much more complicated models",
      status: "Delivered",
      likes: 1,
    },
    {
      id: 3,
      title: "Native booking system and chat system",
      description:
        "A built-in booking system for tours and hotels with much more customizable products (tours) or any other service (appointment service) for example needs block times and much more complicated models",
      status: "In progress",
      likes: 1,
    },
    {
      id: 4,
      title: "Native booking system and chat system",
      description:
        "A built-in booking system for tours and hotels with much more customizable products (tours) or any other service (appointment service) for example needs block times and much more complicated models",
      status: "New Request",
      likes: 1,
    },
  ];

  // Filter handlers
  const getFilteredItems = () => {
    if (activeFilter === "All") return roadmapItems;

    const filterMap = {
      Planned: "Planned",
      "In Progress": "In progress",
      Delivered: "Delivered",
    };

    return roadmapItems.filter(
      (item) =>
        item.status === filterMap[activeFilter] ||
        (activeFilter === "In Progress" && item.status === "In Beta")
    );
  };

  // Get badge color based on status
  const getBadgeColor = (status) => {
    switch (status) {
      case "In Beta":
        return "bg-purple-500 text-white";
      case "Delivered":
        return "bg-green-500 text-white";
      case "In progress":
        return "bg-[#FFBE33] text-white";
      case "New Request":
        return "bg-gray-400 text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 mx-1 sm:mx-2 lg:mx-4 bg-gray-50 min-h-screen">
      {/* Header Section - Following the provided design structure */}
      <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row md:items-center justify-between mb-4 sm:mb-6 md:mb-8">
        <div className="p-3 sm:p-4 md:p-6 w-full md:w-4/5 lg:w-3/4">
          <div className="flex items-center mb-2">
            <img
              src={`${process.env.PUBLIC_URL}/assets/Resources/ProductRoad.png`}
              alt="Product road decoration"
              className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 mr-2 sm:mr-3"
            />
            <h1 className="text-lg sm:text-xl md:text-2xl xl:text-3xl font-semibold">
              Product Roadmap
            </h1>
          </div>
          <p className="text-gray-600 mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base lg:text-lg">
            Take a look at our current product roadmap for new features,
            improvements, and bug fixes. Want to submit your feature request or
            suggestion? We would love to hear your feedback.
          </p>
        </div>
        <div className="">
          <img
            src={`${process.env.PUBLIC_URL}/assets/Resources/productRoadmap-decorate.png`}
            alt="Product roadmap header decoration"
            className="hidden md:block md:h-48 w-full md:w-auto"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap mb-3 sm:mb-4 gap-1 sm:gap-2">
        {["All", "Planned", "In Progress", "Delivered"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 sm:px-4 md:px-6 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium ${
              activeFilter === filter
                ? "bg-[#FFBE33] text-white"
                : "bg-white text-gray-700 border border-[#FFBE33] hover:bg-gray-50"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Roadmap Items */}
      <div className="space-y-0 shadow-lg">
        {getFilteredItems().map((item) => (
          <div
            key={item.id}
            className="bg-white border-b-2 border-gray-100 px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-7"
          >
            <div className="flex flex-col space-y-2">
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold">
                {item.title}
              </h3>
              <div className="flex flex-col lg:flex-row lg:space-x-2 justify-between">
                <p className="text-xs sm:text-sm md:text-base text-gray-600 w-full lg:w-3/4 my-1">
                  {item.description}
                </p>

                <div className="flex flex-row lg:flex-col xl:flex-row justify-between items-start lg:items-center mt-2 lg:mt-0 space-y-0 lg:space-y-2 xl:space-y-0">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium w-24 sm:w-28 md:w-32 inline-block text-center ${getBadgeColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>

                  <div className="flex items-center space-x-1 ml-2 lg:ml-0 xl:ml-2">
                    <button className="p-1 text-gray-400 hover:text-red-500">
                      <Heart size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    </button>
                    <span className="text-xs sm:text-sm text-gray-500">{item.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRoadmap;