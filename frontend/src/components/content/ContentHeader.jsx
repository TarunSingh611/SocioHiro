import React from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const ContentHeader = ({ onCreateNew }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Content</h1>
        <p className="text-gray-600 mt-1 sm:mt-2 text-sm">
          Manage your social media content
        </p>
      </div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
        <button
          onClick={onCreateNew}
          className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-2" />
          New Content
        </button>
        <Link
          to="/dashboard"
          className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeftIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ContentHeader; 