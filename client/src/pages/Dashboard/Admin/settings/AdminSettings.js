import React, { useState } from 'react';
import AdminSidebar from '../AdminSidebar';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('General');

  const handleInputChange = (e) => {
    // In a real implementation, you would handle input changes here
    console.log('Input changed:', e.target.name, e.target.value);
  };

  const handleSave = () => {
    // Handle save functionality
    console.log('Saving profile data');
  };

  const handleCancel = () => {
    // Handle cancel functionality
    console.log('Cancelled changes');
  };

  const tabs = [
    { icon: 'settings', label: 'General' },
    { icon: 'user', label: 'Account' },
    { icon: 'link', label: 'Link account' },
    { icon: 'globe', label: 'Language' },
    { icon: 'lock', label: 'Password' },
    { icon: 'bell', label: 'Push Notificatons' }
  ];

  // Function to render icon with correct color based on active state
  const renderIcon = (iconName, isActive) => {
    const iconColor = isActive ? "text-white" : "text-[#FFAE00]";
    
    switch (iconName) {
      case 'settings':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        );
      case 'user':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        );
      case 'link':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
          </svg>
        );
      case 'globe':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
          </svg>
        );
      case 'lock':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        );
      case 'bell':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${iconColor}`} viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <AdminSidebar active='Settings' />
      
      <div className="flex-1 p-4 md:p-8 relative">
        <div className="mb-6">
          <div className="w-full">
            <h1 className="text-2xl font-semibold text-gray-700">Settings</h1>
            <p className="text-sm text-gray-500">Configure platform preferences and security</p>
          </div>
          <div className="flex justify-end mt-4 sm:mt-0 sm:absolute sm:right-8 sm:top-8">
            <button className="bg-[#FFBE33] hover:bg-yellow-400 hover:text-[#032B68] text-white py-2 px-4 rounded-md flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left panel - settings tabs */}
          <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-lg p-4">
            <ul>
              {tabs.map((tab, index) => (
                <React.Fragment key={tab.label}>
                  <li 
                    className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
                      activeTab === tab.label ? 'bg-[#FFBE33] text-white' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab(tab.label)}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      activeTab === tab.label ? 'bg-[#FFBE33]' : 'bg-[#FFBE334D]'
                    }`}>
                      {renderIcon(tab.icon, activeTab === tab.label)}
                    </div>
                    <span className="ml-3 font-medium">{tab.label}</span>
                  </li>
                  {/* Add horizontal rule after each item except the last one */}
                  {index < tabs.length - 1 && <hr className="border-gray-200 my-2" />}
                </React.Fragment>
              ))}
            </ul>
          </div>

          {/* Right panel - form contents */}
          <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">General Settings</h2>
            <hr className="border-gray-200 mb-6" />
            
            {/* Profile photo section - Updated to match the image style */}
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden mr-4 relative border-4 border-[#FFBE33]">
                <img src="https://placehold.co/40x40" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">We only support .JPG, .JPEG, .PNG file</p>
                <div className="flex gap-2">
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm">Upload Photo</button>
                  <button className="bg-[#FFBE33] hover:bg-yellow-400 hover:text-[#032B68] text-white px-3 py-1 rounded-md text-sm">Delete Photo</button>
                </div>
              </div>
            </div>

            {/* Form fields */}
            <div className="space-y-6">
              {/* Name fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Neurotic"
                      onChange={handleInputChange}
                      className="bg-gray-100 border border-gray-200 rounded-md py-2 pl-10 pr-4 block w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Spy"
                      onChange={handleInputChange}
                      className="bg-gray-100 border border-gray-200 rounded-md py-2 pl-10 pr-4 block w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Contact fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="neurotic@laldo.com"
                      onChange={handleInputChange}
                      className="bg-gray-100 border border-gray-200 rounded-md py-2 pl-10 pr-4 block w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="phone"
                      placeholder="+1 707 797 0462"
                      onChange={handleInputChange}
                      className="bg-gray-100 border border-gray-200 rounded-md py-2 pl-10 pr-4 block w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Address header */}
              <div>
                <h3 className="text-lg font-medium">Personal Address</h3>
                <hr className="border-gray-200 my-4" />
              </div>

              {/* Country and City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    placeholder="IND"
                    onChange={handleInputChange}
                    className="bg-gray-100 border border-gray-200 rounded-md py-2 px-4 block w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="city"
                      placeholder="Delhi"
                      onChange={handleInputChange}
                      className="bg-gray-100 border border-gray-200 rounded-md py-2 pl-10 pr-4 block w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Address and Postal Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="address"
                      placeholder="Delhi,India"
                      onChange={handleInputChange}
                      className="bg-gray-100 border border-gray-200 rounded-md py-2 pl-10 pr-4 block w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="1214"
                      onChange={handleInputChange}
                      className="bg-gray-100 border border-gray-200 rounded-md py-2 pl-10 pr-4 block w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button 
                onClick={handleCancel}
                className="text-[#5d420a] bg-gray-200 hover:text-black font-medium px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="bg-[#FFBE33] hover:bg-yellow-400 hover:text-[#032B68] text-white px-4 py-2 rounded-md font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;