import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PhotoIcon,
  VideoCameraIcon,
  PlayIcon,
  PauseIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  CogIcon,
  MegaphoneIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const Content = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);

  // Mock data for content
  const [contentData, setContentData] = useState({
    posts: [
      {
        id: 1,
        type: 'post',
        title: 'Summer Collection Launch',
        description: 'Introducing our new summer collection with vibrant colors and comfortable fabrics.',
        mediaUrl: 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Post+1',
        platform: 'instagram',
        status: 'published',
        publishedAt: '2024-01-15T10:30:00Z',
        engagement: {
          likes: 1247,
          comments: 89,
          shares: 23,
          views: 15420
        },
        campaign: {
          id: 1,
          name: 'Summer Collection 2024',
          status: 'active'
        },
        automation: {
          id: 1,
          name: 'Auto-reply to comments',
          status: 'active'
        }
      },
      {
        id: 2,
        type: 'post',
        title: 'Behind the Scenes',
        description: 'A sneak peek into our design process and creative journey.',
        mediaUrl: 'https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=Post+2',
        platform: 'instagram',
        status: 'scheduled',
        scheduledAt: '2024-01-20T14:00:00Z',
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0
        },
        campaign: {
          id: 2,
          name: 'Brand Awareness',
          status: 'active'
        },
        automation: null
      },
      {
        id: 3,
        type: 'post',
        title: 'Customer Spotlight',
        description: 'Amazing feedback from our valued customers!',
        mediaUrl: 'https://via.placeholder.com/300x300/45B7D1/FFFFFF?text=Post+3',
        platform: 'instagram',
        status: 'published',
        publishedAt: '2024-01-10T09:15:00Z',
        engagement: {
          likes: 892,
          comments: 45,
          shares: 12,
          views: 8760
        },
        campaign: null,
        automation: {
          id: 2,
          name: 'Welcome new followers',
          status: 'active'
        }
      }
    ],
    reels: [
      {
        id: 4,
        type: 'reel',
        title: 'Product Demo Video',
        description: 'See our products in action with this quick demo.',
        mediaUrl: 'https://via.placeholder.com/300x500/96CEB4/FFFFFF?text=Reel+1',
        platform: 'instagram',
        status: 'published',
        publishedAt: '2024-01-12T16:45:00Z',
        engagement: {
          likes: 2156,
          comments: 134,
          shares: 67,
          views: 28900
        },
        campaign: {
          id: 3,
          name: 'Video Marketing',
          status: 'active'
        },
        automation: {
          id: 3,
          name: 'Auto-like comments',
          status: 'active'
        }
      },
      {
        id: 5,
        type: 'reel',
        title: 'Tutorial: Styling Tips',
        description: 'Learn how to style our latest collection.',
        mediaUrl: 'https://via.placeholder.com/300x500/FFEAA7/FFFFFF?text=Reel+2',
        platform: 'instagram',
        status: 'draft',
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0
        },
        campaign: null,
        automation: null
      }
    ],
    stories: [
      {
        id: 6,
        type: 'story',
        title: 'Flash Sale Alert',
        description: 'Limited time offer - 50% off selected items!',
        mediaUrl: 'https://via.placeholder.com/300x600/DDA0DD/FFFFFF?text=Story+1',
        platform: 'instagram',
        status: 'published',
        publishedAt: '2024-01-14T11:20:00Z',
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          views: 3420
        },
        campaign: {
          id: 4,
          name: 'Flash Sale',
          status: 'active'
        },
        automation: null
      },
      {
        id: 7,
        type: 'story',
        title: 'Daily Inspiration',
        description: 'Start your day with some fashion inspiration.',
        mediaUrl: 'https://via.placeholder.com/300x600/98D8C8/FFFFFF?text=Story+2',
        platform: 'instagram',
        status: 'published',
        publishedAt: '2024-01-13T08:00:00Z',
        engagement: {
          likes: 0,
          comments: 0,
          shares: 0,
          views: 1890
        },
        campaign: null,
        automation: null
      }
    ]
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const tabs = [
    { id: 'posts', name: 'Posts', icon: PhotoIcon },
    { id: 'reels', name: 'Reels', icon: VideoCameraIcon },
    { id: 'stories', name: 'Stories', icon: PlayIcon }
  ];

  const filters = [
    { id: 'all', name: 'All Content' },
    { id: 'published', name: 'Published' },
    { id: 'scheduled', name: 'Scheduled' },
    { id: 'draft', name: 'Draft' },
    { id: 'with-campaign', name: 'With Campaign' },
    { id: 'with-automation', name: 'With Automation' }
  ];

  const getCurrentContent = () => {
    let content = contentData[activeTab] || [];
    
    if (activeFilter === 'all') return content;
    if (activeFilter === 'published') return content.filter(item => item.status === 'published');
    if (activeFilter === 'scheduled') return content.filter(item => item.status === 'scheduled');
    if (activeFilter === 'draft') return content.filter(item => item.status === 'draft');
    if (activeFilter === 'with-campaign') return content.filter(item => item.campaign);
    if (activeFilter === 'with-automation') return content.filter(item => item.automation);
    
    return content;
  };

  const currentContent = getCurrentContent();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = currentContent.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(currentContent.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleStatusChange = (contentId, newStatus) => {
    setContentData(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(item => 
        item.id === contentId ? { ...item, status: newStatus } : item
      )
    }));
  };

  const handleDelete = (contentId) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      setContentData(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(item => item.id !== contentId)
      }));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      published: 'bg-green-100 text-green-800',
      scheduled: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-2">Manage your posts, reels, and stories</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mt-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/campaigns/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <MegaphoneIcon className="h-4 w-4 mr-2" />
            Create Campaign
          </Link>
          <Link
            to="/automation/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            <CogIcon className="h-4 w-4 mr-2" />
            Add Automation
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <PhotoIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-semibold text-gray-900">{contentData.posts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <VideoCameraIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reels</p>
              <p className="text-2xl font-semibold text-gray-900">{contentData.reels.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-pink-100 rounded-lg">
              <PlayIcon className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Stories</p>
              <p className="text-2xl font-semibold text-gray-900">{contentData.stories.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Object.values(contentData).flat().filter(item => item.status === 'published').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5 inline mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <FunnelIcon className="h-4 w-4 text-gray-400" />
          <select
            value={activeFilter}
            onChange={(e) => {
              setActiveFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            {filters.map(filter => (
              <option key={filter.id} value={filter.id}>{filter.name}</option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-500">
          {currentContent.length} items found
        </div>
      </div>

      {/* Content Grid */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {currentItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentItems.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  {/* Media Preview */}
                  <div className="relative mb-4">
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      {item.type === 'post' && <PhotoIcon className="h-5 w-5 text-white bg-black bg-opacity-50 rounded-full p-1" />}
                      {item.type === 'reel' && <VideoCameraIcon className="h-5 w-5 text-white bg-black bg-opacity-50 rounded-full p-1" />}
                      {item.type === 'story' && <PlayIcon className="h-5 w-5 text-white bg-black bg-opacity-50 rounded-full p-1" />}
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                    
                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <HeartIcon className="h-3 w-3 mr-1" />
                          {item.engagement.likes}
                        </span>
                        <span className="flex items-center">
                          <ChatBubbleLeftIcon className="h-3 w-3 mr-1" />
                          {item.engagement.comments}
                        </span>
                        <span className="flex items-center">
                          <EyeIcon className="h-3 w-3 mr-1" />
                          {item.engagement.views}
                        </span>
                      </div>
                    </div>

                    {/* Campaign & Automation Info */}
                    <div className="space-y-2">
                      {item.campaign && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Campaign:</span>
                          <span className="text-blue-600 font-medium">{item.campaign.name}</span>
                        </div>
                      )}
                      {item.automation && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Automation:</span>
                          <span className="text-green-600 font-medium">{item.automation.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex space-x-1">
                        {item.status === 'published' ? (
                          <button
                            onClick={() => handleStatusChange(item.id, 'draft')}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded hover:bg-yellow-200"
                          >
                            <PauseIcon className="h-3 w-3 mr-1" />
                            Pause
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(item.id, 'published')}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200"
                          >
                            <PlayIcon className="h-3 w-3 mr-1" />
                            Publish
                          </button>
                        )}
                        <Link
                          to={`/content/edit/${item.id}`}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
                        >
                          <PencilIcon className="h-3 w-3 mr-1" />
                          Edit
                        </Link>
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No content found</h3>
              <p className="mt-1 text-sm text-gray-500">Create your first {activeTab.slice(0, -1)} to get started.</p>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Content; 