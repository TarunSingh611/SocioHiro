import React, { useState, useEffect } from 'react';
import MediaUpload from './MediaUpload';

const ContentForm = ({ 
  content, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'post',
    content: '',
    mediaUrls: [],
    scheduledDate: '',
    scheduledTime: '',
    hashtags: '',
    location: '',
    isPublished: false
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    if (content) {
      setFormData({
        title: content?.title || '',
        description: content?.description || '',
        type: content?.type || 'post',
        content: content?.content || '',
        mediaUrls: content?.mediaUrls || [],
        scheduledDate: content?.scheduledDate || '',
        scheduledTime: content?.scheduledTime || '',
        hashtags: Array.isArray(content?.hashtags) ? content.hashtags.join(', ') : '',
        location: content?.location || '',
        isPublished: content?.isPublished !== false
      });
    }
  }, [content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const processedData = {
      ...formData,
      hashtags: formData.hashtags ? formData.hashtags.split(',').map(tag => tag.trim()) : [],
      mediaUrls: uploadedFiles.map(file => file.url || file.name)
    };
    
    onSubmit(processedData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMediaUpload = (files) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const getMaxFiles = () => {
    switch (formData.type) {
      case 'carousel':
        return 10;
      case 'story':
        return 1;
      case 'reel':
        return 1;
      default:
        return 1;
    }
  };

  const getAcceptedTypes = () => {
    switch (formData.type) {
      case 'story':
      case 'reel':
        return ['image/*', 'video/*'];
      case 'carousel':
        return ['image/*'];
      default:
        return ['image/*', 'video/*'];
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 sm:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            {content ? 'Edit Content' : 'Create New Content'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter content title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="post">Post</option>
                  <option value="story">Story</option>
                  <option value="reel">Reel</option>
                  <option value="carousel">Carousel</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter content description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter content text"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hashtags
                </label>
                <input
                  type="text"
                  value={formData.hashtags}
                  onChange={(e) => handleInputChange('hashtags', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter hashtags separated by commas"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter location"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Time
                </label>
                <input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Media Upload
              </label>
              <MediaUpload
                onUpload={handleMediaUpload}
                maxFiles={getMaxFiles()}
                acceptedTypes={getAcceptedTypes()}
                uploadedFiles={uploadedFiles}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
                Publish immediately
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : (content ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContentForm; 