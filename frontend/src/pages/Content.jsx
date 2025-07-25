import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const Content = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'post',
    content: '',
    mediaUrls: '',
    scheduledDate: '',
    scheduledTime: '',
    hashtags: '',
    location: '',
    isPublished: false
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      // Mock data for now
      const mockContent = [
        {
          id: 1,
          title: 'New Product Launch',
          description: 'Exciting announcement about our latest product',
          type: 'post',
          content: 'We\'re thrilled to announce our newest product! 🎉 Check it out and let us know what you think!',
          mediaUrls: ['https://example.com/image1.jpg'],
          hashtags: ['#newproduct', '#launch', '#excited'],
          location: 'New York, NY',
          scheduledDate: '2024-01-20',
          scheduledTime: '10:00',
          isPublished: true,
          stats: {
            likes: 1250,
            comments: 89,
            shares: 45,
            reach: 12500
          },
          publishedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          title: 'Behind the Scenes',
          description: 'A glimpse into our creative process',
          type: 'story',
          content: 'Here\'s what goes into creating amazing content! 📸',
          mediaUrls: ['https://example.com/video1.mp4'],
          hashtags: ['#behindthescenes', '#creative', '#process'],
          location: 'Los Angeles, CA',
          scheduledDate: '2024-01-18',
          scheduledTime: '14:30',
          isPublished: false,
          stats: null,
          publishedAt: null
        },
        {
          id: 3,
          title: 'Customer Spotlight',
          description: 'Highlighting our amazing customers',
          type: 'carousel',
          content: 'Meet some of our incredible customers! Their stories inspire us every day.',
          mediaUrls: ['https://example.com/image2.jpg', 'https://example.com/image3.jpg'],
          hashtags: ['#customerspotlight', '#community', '#inspiration'],
          location: 'Chicago, IL',
          scheduledDate: '2024-01-22',
          scheduledTime: '09:00',
          isPublished: false,
          stats: null,
          publishedAt: null
        }
      ];
      setContent(mockContent);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContent) {
        // Update existing content
        setContent(prev => prev.map(item => 
          item.id === editingContent.id 
            ? { ...item, ...formData }
            : item
        ));
      } else {
        // Create new content
        const newContent = {
          id: Date.now(),
          ...formData,
          stats: null,
          publishedAt: null
        };
        setContent(prev => [...prev, newContent]);
      }
      setShowAddModal(false);
      setEditingContent(null);
      resetForm();
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const handleEdit = (contentItem) => {
    setEditingContent(contentItem);
    setFormData({
      title: contentItem.title || '',
      description: contentItem.description || '',
      type: contentItem.type || 'post',
      content: contentItem.content || '',
      mediaUrls: Array.isArray(contentItem.mediaUrls) ? contentItem.mediaUrls.join(', ') : '',
      scheduledDate: contentItem.scheduledDate || '',
      scheduledTime: contentItem.scheduledTime || '',
      hashtags: Array.isArray(contentItem.hashtags) ? contentItem.hashtags.join(', ') : '',
      location: contentItem.location || '',
      isPublished: contentItem.isPublished !== false
    });
    setShowAddModal(true);
  };

  const handleDelete = async (contentId) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        setContent(prev => prev.filter(item => item.id !== contentId));
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  const handlePublish = async (contentId) => {
    try {
      setContent(prev => prev.map(item => 
        item.id === contentId 
          ? { 
              ...item, 
              isPublished: true, 
              publishedAt: new Date().toISOString(),
              stats: { likes: 0, comments: 0, shares: 0, reach: 0 }
            }
          : item
      ));
    } catch (error) {
      console.error('Error publishing content:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'post',
      content: '',
      mediaUrls: '',
      scheduledDate: '',
      scheduledTime: '',
      hashtags: '',
      location: '',
      isPublished: false
    });
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Content</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm">Manage your social media content</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
              <PhotoIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Content</p>
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">{content.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Published</p>
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                {content.filter(item => item.isPublished).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                {content.filter(item => !item.isPublished && item.scheduledDate).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
              <HeartIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Likes</p>
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                {content.reduce((sum, item) => sum + (item.stats?.likes || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">All Content</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {content.length > 0 ? (
            content.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <div key={item.id} className="p-4 sm:p-6">
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
                          onClick={() => handlePublish(item.id)}
                          className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                        >
                          <CheckCircleIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-1" />
                          Publish
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(item)}
                        className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        <PhotoIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50"
                      >
                        <XCircleIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center">
              <PhotoIcon className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No content</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">Create your first content piece to get started.</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent shadow-sm text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-2" />
                  Create Content
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 sm:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                {editingContent ? 'Edit Content' : 'Create New Content'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Content Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Content Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="post">Post</option>
                      <option value="story">Story</option>
                      <option value="reel">Reel</option>
                      <option value="carousel">Carousel</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write your content here..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Scheduled Date
                    </label>
                    <input
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Scheduled Time
                    </label>
                    <input
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Hashtags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.hashtags}
                    onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#hashtag1, #hashtag2, #hashtag3"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City, State"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingContent(null);
                      resetForm();
                    }}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    {editingContent ? 'Update Content' : 'Create Content'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Content; 