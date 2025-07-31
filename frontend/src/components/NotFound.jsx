import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ExclamationTriangleIcon,
  HomeIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  MapIcon
} from '@heroicons/react/24/outline';

const NotFound = ({ 
  title = "Page Not Found",
  subtitle = "The page you're looking for doesn't exist or has been moved.",
  errorCode = "404",
  showHomeButton = true,
  showBackButton = true,
  className = ""
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 relative overflow-hidden ${className}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-orange-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Code */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-6 relative">
              <ExclamationTriangleIcon className="w-16 h-16 text-white" />
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-ping opacity-75"></div>
            </div>
            
            <h1 className="text-8xl md:text-9xl font-bold text-gray-900 mb-4 tracking-tight">
              {errorCode}
            </h1>
          </div>

          {/* Content */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
              {subtitle}
            </p>

            {/* Search Suggestion */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-lg mb-8">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg mb-4 mx-auto">
                <MagnifyingGlassIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can't find what you're looking for?
              </h3>
              <p className="text-gray-600 text-sm">
                Try checking the URL for typos or use the navigation menu to find your way back.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {showBackButton && (
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Go Back
              </button>
            )}
            
            {showHomeButton && (
              <Link
                to="/"
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                Go Home
              </Link>
            )}
          </div>

          {/* Animated Elements */}
          <div className="mt-12 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 