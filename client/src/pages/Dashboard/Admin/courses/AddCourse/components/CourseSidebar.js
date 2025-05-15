import React from "react";
import { Upload } from "lucide-react";

const CourseSidebar = ({
  visibility,
  setVisibility,
  lastUpdated,
  pricingModel,
  setPricingModel,
  currency,
  setCurrency,
  regularPrice,
  setRegularPrice,
  discountedPrice,
  setDiscountedPrice,
  handleFeaturedImageChange,
  handleIntroVideoChange,
  introVideoUrl,
  setIntroVideoUrl,
  isScheduled,
  setIsScheduled,
  scheduleDate,
  setScheduleDate,
  scheduleTime,
  setScheduleTime,
  showComingSoon,
  setShowComingSoon,
  tags,
  setTags,
}) => {
  return (
    <>
      {/* Visibility section */}
      <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-medium mb-2">Visibility</h3>
        <div className="relative mb-2">
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md appearance-none"
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
            <option value="Password">Password Protected</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
        <p className="text-sm text-gray-500">Last updated on {lastUpdated}</p>
      </div>

      {/* Pricing section */}
      <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-medium mb-4">Pricing Model</h3>
        <div className="flex space-x-4 mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="pricing"
              checked={pricingModel === "Free"}
              onChange={() => setPricingModel("Free")}
              className="mr-2"
            />
            <span className="text-sm">Free</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="pricing"
              checked={pricingModel === "Paid"}
              onChange={() => setPricingModel("Paid")}
              className="mr-2"
            />
            <span className="text-sm">Paid</span>
          </label>
        </div>

        {pricingModel === "Paid" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Regular Price</label>
              <div className="flex">
                <div className="relative">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="h-full rounded-l-md border border-r-0 border-gray-300 bg-white py-2 px-3 appearance-none"
                  >
                    <option value="€">€</option>
                    <option value="$">$</option>
                    <option value="£">£</option>
                  </select>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={regularPrice}
                  onChange={(e) => setRegularPrice(e.target.value)}
                  className="flex-1 rounded-r-md border border-gray-300 py-2 px-3"
                  placeholder="49.99"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price</label>
              <div className="flex">
                <div className="relative">
                  <select
                    value={currency}
                    className="h-full rounded-l-md border border-r-0 border-gray-300 bg-white py-2 px-3 appearance-none"
                    disabled
                  >
                    <option value="€">€</option>
                  </select>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={discountedPrice}
                  onChange={(e) => setDiscountedPrice(e.target.value)}
                  className="flex-1 rounded-r-md border border-gray-300 py-2 px-3"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Featured Image */}
      <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-medium mb-2">Featured Image</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
          <input id="featuredImageInput" type="file" accept="image/*" onChange={handleFeaturedImageChange} className="hidden" />
          <button
            onClick={() => document.getElementById("featuredImageInput").click()}
            className="inline-flex items-center justify-center w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            <Upload size={18} className="mr-2" />
            Upload Image
          </button>
        </div>
      </div>

      {/* Intro Video */}
      <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-medium mb-2">Intro Video</h3>
        <p className="text-xs text-gray-500 mb-2">MP4, and WebM formats, up to 512 MB</p>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
          <input id="introVideoInput" type="file" accept="video/*" onChange={handleIntroVideoChange} className="hidden" />
          <button
            onClick={() => document.getElementById("introVideoInput").click()}
            className="inline-flex items-center justify-center w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 mb-2"
          >
            <Upload size={18} className="mr-2" />
            Upload Video
          </button>
          <p className="text-center text-gray-500 text-sm mb-2">Or</p>
          <input
            type="text"
            placeholder="Type URL here.."
            value={introVideoUrl}
            onChange={(e) => setIntroVideoUrl(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Schedule */}
      <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Schedule</h3>
          <div className="relative">
            <div
              className={`w-12 h-6 flex items-center ${
                isScheduled ? "bg-yellow-400" : "bg-gray-200"
              } rounded-full p-1 cursor-pointer`}
              onClick={() => setIsScheduled(!isScheduled)}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform ${
                  isScheduled ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </div>
          </div>
        </div>

        {isScheduled && (
          <div className="mt-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-md p-2">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <input
                    type="text"
                    placeholder="Select Date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full border-none focus:outline-none"
                  />
                </div>
              </div>
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-md p-2">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <input
                    type="text"
                    placeholder="hh:mm AM"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full border-none focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                id="showComingSoon"
                checked={showComingSoon}
                onChange={() => setShowComingSoon(!showComingSoon)}
                className="mr-2"
              />
              <label htmlFor="showComingSoon" className="text-sm text-gray-600">
                Show "Coming Soon" Tag on the content poster
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-medium mb-2">Tags</h3>
        <input
          type="text"
          placeholder="Type here"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
    </>
  );
};

export default CourseSidebar;
