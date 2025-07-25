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
  HeartIcon
} from '@heroicons/react/24/outline';

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

  useEffect(() => {
    fetchCampaigns();
  }, []);

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
      await updateCampaign(campaignId, { isActive: !currentStatus });
      fetchCampaigns();
    } catch (error) {
      console.error('Error toggling campaign status:', error);
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
    const icons = {
      post: PhotoIcon,
      story: VideoCameraIcon,
      carousel: DocumentTextIcon
    };
    return icons[type] || PhotoIcon;
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      published: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800'
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
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600 mt-2">Manage your social media campaigns</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mt-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
        <Link
          to="/campaigns/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Campaign
        </Link>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-blue-500">
                <MegaphoneIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Campaigns
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {campaigns.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-green-500">
                <PlayIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {campaigns.filter(c => c?.status === 'active').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-yellow-500">
                <PauseIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Paused
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {campaigns.filter(c => c?.status === 'paused').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md p-3 bg-purple-500">
                <EyeIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Reach
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {campaigns.reduce((sum, c) => sum + (c?.reach || 0), 0).toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Posts */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Posts</h3>
          <p className="text-sm text-gray-500">Scheduled content for the next 7 days</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Array.isArray(scheduledPosts) && scheduledPosts.length > 0 ? (
              scheduledPosts.map((post) => (
                <div key={post?._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {post?.type === 'post' ? (
                        <PhotoIcon className="h-8 w-8 text-blue-500" />
                      ) : post?.type === 'story' ? (
                        <VideoCameraIcon className="h-8 w-8 text-blue-500" />
                      ) : (
                        <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{post?.name || 'Untitled Campaign'}</h4>
                      <p className="text-sm text-gray-500">{post?.content || 'No content'}</p>
                      <p className="text-xs text-gray-400">
                        {post?.scheduledDate && post?.scheduledTime 
                          ? new Date(`${post.scheduledDate} ${post.scheduledTime}`).toLocaleString()
                          : 'Not scheduled'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(post?.status)}`}>
                      {post?.status || 'draft'}
                    </span>
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 text-gray-400 hover:text-gray-500"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming posts</h3>
                <p className="mt-1 text-sm text-gray-500">Schedule your first campaign to see it here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Campaigns</h2>
          <p className="text-sm text-gray-500">Manage your social media campaigns</p>
        </div>
        <div className="p-6">
          {Array.isArray(campaigns) && campaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <div key={campaign?._id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {campaign?.type === 'post' ? (
                        <PhotoIcon className="h-6 w-6 text-blue-500 mr-2" />
                      ) : campaign?.type === 'story' ? (
                        <VideoCameraIcon className="h-6 w-6 text-blue-500 mr-2" />
                      ) : (
                        <DocumentTextIcon className="h-6 w-6 text-blue-500 mr-2" />
                      )}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {campaign?.name || 'Untitled Campaign'}
                      </h3>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign?.status)}`}>
                      {campaign?.status || 'draft'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {campaign?.description || 'No description'}
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Content</span>
                      <p className="text-sm text-gray-900 mt-1 line-clamp-2">
                        {campaign?.content || 'No content'}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Scheduled</span>
                      <span className="text-sm text-gray-900">
                        {campaign?.scheduledDate && campaign?.scheduledTime 
                          ? `${campaign.scheduledDate} at ${campaign.scheduledTime}`
                          : 'Not scheduled'
                        }
                      </span>
                    </div>
                    
                    {Array.isArray(campaign?.hashtags) && campaign.hashtags.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-500">Hashtags</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {campaign.hashtags.map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Reach</span>
                      <span className="text-sm text-gray-900">{campaign?.reach || 0}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Engagement</span>
                      <span className="text-sm text-gray-900">{campaign?.engagement || 0}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleStatus(campaign._id, campaign.isActive)}
                      className={`flex-1 inline-flex items-center justify-center px-3 py-2 border text-sm font-medium rounded-md ${
                        campaign?.isActive
                          ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
                          : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                      }`}
                    >
                      {campaign?.isActive ? (
                        <>
                          <PauseIcon className="h-4 w-4 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <PlayIcon className="h-4 w-4 mr-1" />
                          Activate
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleEdit(campaign)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDelete(campaign._id)}
                      className="inline-flex items-center justify-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MegaphoneIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns</h3>
              <p className="mt-1 text-sm text-gray-500">Create your first campaign to get started.</p>
              <div className="mt-6">
                <Link
                  to="/campaigns/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
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
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCampaign ? 'Edit Campaign' : 'Create Campaign'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Content Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="post">Post</option>
                    <option value="story">Story</option>
                    <option value="carousel">Carousel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    rows="4"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Media URLs (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.mediaUrls}
                    onChange={(e) => setFormData({...formData, mediaUrls: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Scheduled Date
                    </label>
                    <input
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Scheduled Time
                    </label>
                    <input
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hashtags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.hashtags}
                    onChange={(e) => setFormData({...formData, hashtags: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="fashion, style, summer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="New York, NY"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    {editingCampaign ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingCampaign(null);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
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