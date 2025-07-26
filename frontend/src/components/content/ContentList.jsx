import React from 'react';
import {
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const ContentList = ({ 
  content, 
  onEdit, 
  onDelete, 
  onPublish, 
  onCreateNew 
}) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'post': return PhotoIcon;
      case 'story': return VideoCameraIcon;
      case 'reel': return VideoCameraIcon;
      case 'carousel': return DocumentTextIcon;
      default: return PhotoIcon;
    }
  };

  const getStatusColor = (isPublished) => {
    return isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  // Ensure content is an array and handle different ID formats
  const contentArray = Array.isArray(content) ? content : [];
  
  if (!contentArray.length) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-8 text-center">
          <PhotoIcon className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No content</h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Create your first content piece to get started.
          </p>
          <div className="mt-6">
            <button
              onClick={onCreateNew}
              className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent shadow-sm text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Content
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">All Content</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {contentArray.map((item) => {
          const TypeIcon = getTypeIcon(item.type);
          // Handle both MongoDB _id and regular id
          const itemId = item._id || item.id;
          
          return (
            <div key={itemId} className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 sm:p-3 bg-gray-100 rounded-lg">
                      <TypeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      {item.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.isPublished)}`}>
                        {item.isPublished ? 'Published' : 'Draft'}
                      </span>
                      {item.scheduledDate && (
                        <span className="text-xs text-gray-500">
                          {new Date(item.scheduledDate).toLocaleDateString()}
                        </span>
                      )}
                      {item.isPublished && item.stats && (
                        <span className="text-xs text-gray-500">
                          {item.stats.likes} likes
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {!item.isPublished && (
                    <button
                      onClick={() => onPublish(itemId)}
                      className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                    >
                      <CheckCircleIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-1" />
                      Publish
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(item)}
                    className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <PhotoIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(itemId)}
                    className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50"
                  >
                    <XCircleIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContentList; 