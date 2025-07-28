import React, { useState } from 'react';
import {
  PhotoIcon,
  PlusIcon,
  FunnelIcon,
  Squares2X2Icon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import ContentCard from './ContentCard';

const ContentList = ({ 
  content, 
  onEdit, 
  onDelete, 
  onPublish, 
  onCreateNew 
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [performanceFilter, setPerformanceFilter] = useState('all');

  // Filter content based on selected filters
  const filteredContent = content.filter(item => {
    // Content type filter
    if (contentTypeFilter !== 'all' && item?.type !== contentTypeFilter) {
      return false;
    }

    // Performance filter
    if (performanceFilter === 'high' && !item?.performance?.isHighPerforming) {
      return false;
    }
    if (performanceFilter === 'underperforming' && !item?.performance?.isUnderperforming) {
      return false;
    }

    return true;
  });

  // Ensure content is an array and handle different ID formats
  const contentArray = Array.isArray(filteredContent) ? filteredContent : [];
  
  if (!contentArray.length) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-8 text-center">
          <PhotoIcon className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No content</h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            No Instagram content found. Connect your Instagram account to see your media.
          </p>
          <div className="mt-6">
            <button
              onClick={onCreateNew}
              className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent shadow-sm text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Content
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Instagram Content</h3>
            <p className="text-sm text-gray-500 mt-1">Your real Instagram media and content</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Content Type Filter */}
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-4 w-4 text-gray-500" />
              <select
                value={contentTypeFilter}
                onChange={(e) => setContentTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="all">All Types</option>
                <option value="post">Posts</option>
                <option value="reel">Reels</option>
                <option value="story">Stories</option>
              </select>
            </div>

            {/* Performance Filter */}
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-4 w-4 text-gray-500" />
              <select
                value={performanceFilter}
                onChange={(e) => setPerformanceFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="all">All Performance</option>
                <option value="high">High Performing</option>
                <option value="underperforming">Underperforming</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Squares2X2Icon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Bars3Icon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
          {contentArray.map((item) => {
            const itemId = item?._id || item?.id;
            if (!itemId) return null;
            
            return (
              <ContentCard
                key={itemId}
                content={item}
                onEdit={onEdit}
                onDelete={onDelete}
                onPublish={onPublish}
              />
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {contentArray.map((item) => {
            const itemId = item?._id || item?.id;
            if (!itemId) return null;
            
            return (
              <ContentCard
                key={itemId}
                content={item}
                onEdit={onEdit}
                onDelete={onDelete}
                onPublish={onPublish}
              />
            );
          })}
        </div>
      )}

    </div>
  );
};

export default ContentList; 