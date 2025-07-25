import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createCampaign } from '../api';
import {
  PlusIcon,
  ArrowLeftIcon,
  PhotoIcon,
  VideoCameraIcon,
  CalendarIcon,
  MegaphoneIcon,
  HashtagIcon,
  GlobeAltIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const AddCampaign = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'post',
    platform: 'instagram',
    content: '',
    mediaUrls: [],
    hashtags: '',
    scheduledDate: '',
    scheduledTime: '',
    targetAudience: {
      ageRange: '',
      interests: '',
      location: ''
    },
    settings: {
      autoLike: false,
      autoComment: false,
      autoFollow: false,
      autoShare: false
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const campaignData = {
        ...formData,
        hashtags: formData.hashtags ? formData.hashtags.split(',').map(tag => tag.trim()) : [],
        scheduledDate: formData.scheduledDate && formData.scheduledTime 
          ? new Date(`${formData.scheduledDate}T${formData.scheduledTime}`).toISOString()
          : null
      };

      await createCampaign(campaignData);
      navigate('/campaigns');
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Error creating campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('targetAudience.')) {
      const audience = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        targetAudience: {
          ...prev.targetAudience,
          [audience]: value
        }
      }));
    } else if (name.startsWith('settings.')) {
      const setting = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [setting]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const campaignTypes = [
    { value: 'post', label: 'Post', icon: PhotoIcon },
    { value: 'story', label: 'Story', icon: PhotoIcon },
    { value: 'reel', label: 'Reel', icon: VideoCameraIcon },
    { value: 'carousel', label: 'Carousel', icon: PhotoIcon }
  ];

  const platforms = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'tiktok', label: 'TikTok' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Campaign</h1>
          <p className="text-gray-600 mt-2">Schedule and manage your social media campaigns</p>
          <Link
            to="/campaigns"
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mt-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Campaign Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="e.g., Summer Collection Launch"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform *
                </label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {platforms.map(platform => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your campaign goals and strategy..."
              />
            </div>
          </div>

          {/* Content Type */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MegaphoneIcon className="h-5 w-5 mr-2" />
              Content Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {campaignTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Text
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your post caption or content..."
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <PhotoIcon className="h-5 w-5 mr-2" />
              Media
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media URLs (one per line)
              </label>
              <textarea
                name="mediaUrls"
                value={formData.mediaUrls.join('\n')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  mediaUrls: e.target.value.split('\n').filter(url => url.trim())
                }))}
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter one URL per line for images or videos
              </p>
            </div>
          </div>

          {/* Hashtags */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <HashtagIcon className="h-5 w-5 mr-2" />
              Hashtags
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hashtags (comma-separated)
              </label>
              <input
                type="text"
                name="hashtags"
                value={formData.hashtags}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="fashion, summer, style, trending"
              />
              <p className="mt-1 text-sm text-gray-500">
                Use relevant hashtags to increase reach and engagement
              </p>
            </div>
          </div>

          {/* Scheduling */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Scheduling
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheduled Time
                </label>
                <input
                  type="time"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2" />
              Target Audience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Range
                </label>
                <select
                  name="targetAudience.ageRange"
                  value={formData.targetAudience.ageRange}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any age</option>
                  <option value="13-17">13-17</option>
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45-54">45-54</option>
                  <option value="55+">55+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interests
                </label>
                <input
                  type="text"
                  name="targetAudience.interests"
                  value={formData.targetAudience.interests}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="fashion, lifestyle, travel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="targetAudience.location"
                  value={formData.targetAudience.location}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="New York, NY"
                />
              </div>
            </div>
          </div>

          {/* Automation Settings */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <ClockIcon className="h-5 w-5 mr-2" />
              Automation Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="settings.autoLike"
                  checked={formData.settings.autoLike}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Auto-like related posts
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="settings.autoComment"
                  checked={formData.settings.autoComment}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Auto-comment on related posts
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="settings.autoFollow"
                  checked={formData.settings.autoFollow}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Auto-follow relevant accounts
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="settings.autoShare"
                  checked={formData.settings.autoShare}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Auto-share to other platforms
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Link
              to="/campaigns"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Campaign
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCampaign; 