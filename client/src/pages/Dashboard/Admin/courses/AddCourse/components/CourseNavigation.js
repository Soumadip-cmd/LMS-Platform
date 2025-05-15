import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronDown } from 'lucide-react';

const CourseNavigation = ({ 
  currentStep, 
  steps, 
  onSaveDraft, 
  onPublish,
  onNext,
  onPrevious
}) => {
  const navigate = useNavigate();

  return (
    <div className="border-b pb-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h3 className="text-sm font-medium uppercase text-gray-500 mr-6">COURSE BUILDER</h3>
          <div className="flex items-center">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex items-center">
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                      currentStep >= index + 1 ? 'bg-yellow-400' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span 
                    className={`ml-2 text-sm ${
                      currentStep >= index + 1 ? 'text-gray-700' : 'text-gray-500'
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 mx-2 h-px bg-gray-300"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={onSaveDraft}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white"
          >
            <FileText size={16} className="mr-2" />
            Save as Draft
          </button>
          <div className="relative inline-block">
            <button 
              onClick={onPublish}
              className="flex items-center px-4 py-2 bg-yellow-400 rounded-md text-sm font-medium text-white"
            >
              Publish
              <ChevronDown size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Step Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onPrevious}
          disabled={currentStep === 1}
          className={`px-4 py-2 border border-gray-300 rounded-md ${
            currentStep === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
        >
          {currentStep < steps.length ? 'Next' : 'Finish'}
        </button>
      </div>
    </div>
  );
};

export default CourseNavigation;
