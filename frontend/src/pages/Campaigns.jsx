import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCampaigns, createCampaign, updateCampaign, deleteCampaign } from '../api';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  CalendarIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  MegaphoneIcon,
  ArrowLeftIcon,
  EyeIcon,
  HeartIcon,
  WrenchScrewdriverIcon,
  RocketLaunchIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import WorkInProgress from '../components/WorkInProgress';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'post',
    content: '',
    mediaUrls: '',
    scheduledDate: '',
    scheduledTime: '',
    accounts: [],
    hashtags: '',
    location: '',
    isActive: true
  });

  // Check if we're in development mode
  // const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';
  const isDevelopment = false;

  useEffect(() => {
    if (isDevelopment) {
      fetchCampaigns();
    }
  }, [isDevelopment]);

  const fetchCampaigns = async () => {
    try {
      const response = await getCampaigns();
      const campaignsData = Array.isArray(response?.data) ? response.data : [];
      setCampaigns(campaignsData);
      setScheduledPosts(campaignsData.filter(c => c?.status === 'scheduled'));
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        mediaUrls: formData.mediaUrls ? formData.mediaUrls.split(',').map(url => url.trim()).filter(url => url) : [],
        hashtags: formData.hashtags ? formData.hashtags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };
      
      if (editingCampaign) {
        await updateCampaign(editingCampaign._id, data);
      } else {
        await createCampaign(data);
      }
      setShowAddModal(false);
      setEditingCampaign(null);
      resetForm();
      fetchCampaigns();
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  };

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign?.name || '',
      description: campaign?.description || '',
      type: campaign?.type || 'post',
      content: campaign?.content || '',
      mediaUrls: Array.isArray(campaign?.mediaUrls) ? campaign.mediaUrls.join(', ') : '',
      scheduledDate: campaign?.scheduledDate || '',
      scheduledTime: campaign?.scheduledTime || '',
      accounts: campaign?.accounts || [],
      hashtags: Array.isArray(campaign?.hashtags) ? campaign.hashtags.join(', ') : '',
      location: campaign?.location || '',
      isActive: campaign?.isActive !== false
    });
    setShowAddModal(true);
  };

  const handleDelete = async (campaignId) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await deleteCampaign(campaignId);
        fetchCampaigns();
      } catch (error) {
        console.error('Error deleting campaign:', error);
      }
    }
  };

  const handleToggleStatus = async (campaignId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      await updateCampaign(campaignId, { status: newStatus });
      fetchCampaigns();
    } catch (error) {
      console.error('Error updating campaign status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'post',
      content: '',
      mediaUrls: '',
      scheduledDate: '',
      scheduledTime: '',
      accounts: [],
      hashtags: '',
      location: '',
      isActive: true
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'post': return PhotoIcon;
      case 'story': return VideoCameraIcon;
      case 'reel': return VideoCameraIcon;
      case 'carousel': return DocumentTextIcon;
      default: return MegaphoneIcon;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

    if (!isDevelopment) {
    const campaignFeatures = [
      {
        icon: <MegaphoneIcon className="w-6 h-6 text-indigo-600" />,
        title: "Campaign Creation",
        description: "Create engaging campaigns with multiple posts, stories, and reels all in one place."
      },
      {
        icon: <CalendarIcon className="w-6 h-6 text-indigo-600" />,
        title: "Smart Scheduling", 
        description: "Schedule your content at optimal times for maximum engagement and reach."
      },
      {
        icon: <EyeIcon className="w-6 h-6 text-indigo-600" />,
        title: "Analytics & Insights",
        description: "Track performance, analyze engagement, and optimize your campaigns with detailed insights."
      }
    ];

    return (
      <WorkInProgress
        title="Campaigns Coming Soon"
        subtitle="We're building powerful campaign management tools to help you create, schedule, and track your Instagram campaigns."
        features={campaignFeatures}
      />
    );
  }

  // Original Campaigns page for development mode
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm">Manage your social media campaigns</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Link
            to="/campaigns/new"
            className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-2" />
            New Campaign
          </Link>
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
              <MegaphoneIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Campaigns</p>
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">{campaigns.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
              <PlayIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Active</p>
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                {campaigns.filter(c => c?.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
              <PauseIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Paused</p>
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                {campaigns.filter(c => c?.status === 'paused').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
              <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">{scheduledPosts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">All Campaigns</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => {
              const TypeIcon = getTypeIcon(campaign?.type);
              return (
                <div key={campaign?._id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="flex-shrink-0">
                        <div className="p-2 sm:p-3 bg-gray-100 rounded-lg">
                          <TypeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                          {campaign?.name || 'Untitled Campaign'}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">
                          {campaign?.description || 'No description'}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign?.status)}`}>
                            {campaign?.status || 'draft'}
                          </span>
                          {campaign?.scheduledDate && (
                            <span className="text-xs text-gray-500">
                              {new Date(campaign.scheduledDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <button
                        onClick={() => handleToggleStatus(campaign._id, campaign.status)}
                        className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-md ${
                          campaign?.status === 'active'
                            ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200'
                            : 'text-green-700 bg-green-100 hover:bg-green-200'
                        }`}
                      >
                        {campaign?.status === 'active' ? (
                          <>
                            <PauseIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-1" />
                            Pause
                          </>
                        ) : (
                          <>
                            <PlayIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-1" />
                            Activate
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(campaign)}
                        className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        <PencilIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(campaign._id)}
                        className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50"
                      >
                        <TrashIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center">
              <MegaphoneIcon className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">Get started by creating your first campaign.</p>
              <div className="mt-6">
                <Link
                  to="/campaigns/new"
                  className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent shadow-sm text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-2" />
                  Create Campaign
                </Link>
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
                {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Campaign Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Type
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
                    placeholder="Write your post content here..."
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
                    placeholder="#socialmedia, #marketing, #business"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingCampaign(null);
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
                    {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
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

export default Campaigns; 