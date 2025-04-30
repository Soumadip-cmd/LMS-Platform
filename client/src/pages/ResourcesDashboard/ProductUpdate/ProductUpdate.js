import React from 'react';

const ProductUpdate = () => {
  // Product update data
  const latestUpdates = [
    { id: 1, text: '1.0 Preplings is now out of beta!' },
    { id: 2, text: '2.0 Preplings is now available on iphone' },
    { id: 3, text: '3.0 Over 10 new courses added yesterday!' },
  ];

  return (
    <div className="p-4 md:p-6 mx-2 lg:mx-4 bg-gray-50 min-h-screen">
      {/* Header section with icon */}
      <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="mb-4 p-6 md:mb-0">
          <div className="flex items-center mb-2">
            <span className="size-10 mr-1">
              <svg
                data-name="Layer 1"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.985 18.336c-8.581 0-10.554-1.972-10.554-10.553a.6.6 0 0 0-1.2 0c0 8.58-1.972 10.553-10.553 10.553a.6.6 0 1 0 0 1.2c8.581 0 10.554 1.973 10.554 10.554a.6.6 0 0 0 1.2 0c0-8.58 1.972-10.554 10.553-10.554a.6.6 0 1 0 0-1.2ZM24.476 14.081a.6.6 0 0 1-.6-.6c0-4.362-.882-5.245-5.246-5.245a.6.6 0 0 1 0-1.2c4.364 0 5.246-.882 5.246-5.246a.6.6 0 0 1 1.2 0c0 4.364.882 5.246 5.246 5.246a.6.6 0 1 1 0 1.2c-4.364 0-5.246.883-5.246 5.246a.6.6 0 0 1-.6.6Zm-1.86-6.445a3.487 3.487 0 0 1 1.86 1.86 3.487 3.487 0 0 1 1.86-1.86 3.487 3.487 0 0 1-1.86-1.86 3.487 3.487 0 0 1-1.86 1.86Z"
                  fill="#ffd700"
                  className="fill-000000"
                ></path>
              </svg>
            </span>
            <h1 className="text-xl md:text-2xl xl:text-3xl font-semibold">
              Product updates
            </h1>
          </div>
          <p className="text-gray-600 mt-4 md:text-lg text-sm">
            Discover our latest product updates to stay on top of our new
            features
          </p>
        </div>
        <div>
          <img
            src={`${process.env.PUBLIC_URL}/assets/Resources/product-update-img1.png`}
            alt="Product updates header decoration"
            className="hidden md:block md:h-48 w-full md:w-auto"
          />
        </div>
      </div>

      {/* Main content layout - Adjusted container with different grid proportions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-full overflow-hidden">
        {/* Large update card - takes 8/12 columns on large screens */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full">
            <div className="">
              <img
                src={`${process.env.PUBLIC_URL}/assets/Resources/product-update-laptop.png`}
                alt="Update illustration"
                className="w-full object-contain"
              />
            </div>

            <div className="p-6 pt-0">
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <span className="mr-2">📅</span>
                <span>02/04/2025</span>
              </div>

              <h2 className="text-lg font-medium" style={{ color: "#00AB5B" }}>
                1.0- Preplings is now out of beta!
              </h2>

              <p className="mt-2 text-gray-600 text-sm">
                We are thrilled to announce a major milestone in our journey
                together. Preplings officially out of beta! This is an
                exciting moment for us and we want to express our deepest
                gratitude for your feedback.
              </p>

              <div className="mt-4">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                  See More
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar with updates - takes 4/12 columns on large screens */}
        <div className="lg:col-span-4 space-y-6">
          {/* Latest updates card - matches the design in the images */}
          <div className="bg-white rounded-lg shadow-sm p-6 w-full">
            <h2 className="font-bold text-lg mb-4">Latest product updates</h2>
            <div className="space-y-6">
              {latestUpdates.map((update) => (
                <div
                  key={update.id}
                  className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                >
                  <p className="text-gray-800">{update.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nitty gritty details card */}
          <div className="bg-white rounded-lg shadow-sm p-6 w-full">
            <div className="flex items-center mb-4">
              <div className="mr-2">
                <span className="p-1 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </span>
              </div>
              <h2 className="font-bold text-lg">
                Want to go into Nitty gritty Details?
              </h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Browse our detailed product changelog
            </p>
            <button 
              style={{ backgroundColor: "#FFBE33" }} 
              className="text-white font-medium py-2 px-4 rounded-md w-full hover:opacity-90 transition duration-200"
            >
              Read Changelog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;