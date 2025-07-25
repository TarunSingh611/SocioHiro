import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createAutomation } from '../api';
import {
  PlusIcon,
  ArrowLeftIcon,
  BoltIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  UserPlusIcon,
  CogIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const AddAutomation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    trigger: 'comment',
    action: 'send_dm',
    keywords: '',
    responseMessage: '',
    conditions: {
      followerCount: '',
      accountAge: '',
      hasProfilePic: false,
      isVerified: false
    },
    schedule: {
      enabled: false,
      startTime: '',
      endTime: '',
      timezone: 'UTC'
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const automationData = {
        ...formData,
        keywords: formData.keywords ? formData.keywords.split(',').map(keyword => keyword.trim()) : [],
        conditions: {
          ...formData.conditions,
          followerCount: parseInt(formData.conditions.followerCount) || 0,
          accountAge: parseInt(formData.conditions.accountAge) || 0
        }
      };

      await createAutomation(automationData);
      navigate('/automation');
    } catch (error) {
      console.error('Error creating automation:', error);
      alert('Error creating automation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('conditions.')) {
      const condition = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        conditions: {
          ...prev.conditions,
          [condition]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name.startsWith('schedule.')) {
      const schedule = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        schedule: {
          ...prev.schedule,
          [schedule]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const triggerOptions = [
    { value: 'comment', label: 'Comment', icon: ChatBubbleLeftIcon },
    { value: 'dm', label: 'Direct Message', icon: ChatBubbleLeftIcon },
    { value: 'mention', label: 'Mention', icon: BellIcon },
    { value: 'like', label: 'Like', icon: HeartIcon },
    { value: 'follow', label: 'Follow', icon: UserPlusIcon }
  ];

  const actionOptions = [
    { value: 'send_dm', label: 'Send Direct Message', icon: ChatBubbleLeftIcon },
    { value: 'like_post', label: 'Like Post', icon: HeartIcon },
    { value: 'follow_user', label: 'Follow User', icon: UserPlusIcon },
    { value: 'comment_post', label: 'Comment on Post', icon: ChatBubbleLeftIcon },
    { value: 'send_story_reply', label: 'Reply to Story', icon: ChatBubbleLeftIcon }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Automation</h1>
          <p className="text-gray-600 mt-2">Set up automated responses and actions</p>
          <Link
            to="/automation"
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mt-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Automation
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Automation Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="e.g., Auto Reply to Comments"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Active
                  </label>
                </div>
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
                placeholder="Describe what this automation does..."
              />
            </div>
          </div>

          {/* Trigger Configuration */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <BoltIcon className="h-5 w-5 mr-2" />
              Trigger Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trigger Type *
                </label>
                <select
                  name="trigger"
                  value={formData.trigger}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {triggerOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="product, price, info, help"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Leave empty to trigger on all {formData.trigger}s
                </p>
              </div>
            </div>
          </div>

          {/* Action Configuration */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <CogIcon className="h-5 w-5 mr-2" />
              Action Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Type *
                </label>
                <select
                  name="action"
                  value={formData.action}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {actionOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response Message
                </label>
                <textarea
                  name="responseMessage"
                  value={formData.responseMessage}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the message to send..."
                />
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Conditions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Follower Count
                </label>
                <input
                  type="number"
                  name="conditions.followerCount"
                  value={formData.conditions.followerCount}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Account Age (days)
                </label>
                <input
                  type="number"
                  name="conditions.accountAge"
                  value={formData.conditions.accountAge}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="conditions.hasProfilePic"
                  checked={formData.conditions.hasProfilePic}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  User must have profile picture
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="conditions.isVerified"
                  checked={formData.conditions.isVerified}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  User must be verified
                </label>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Schedule (Optional)</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="schedule.enabled"
                  checked={formData.schedule.enabled}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Enable scheduling
                </label>
              </div>
              {formData.schedule.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="schedule.startTime"
                      value={formData.schedule.startTime}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="schedule.endTime"
                      value={formData.schedule.endTime}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      name="schedule.timezone"
                      value={formData.schedule.timezone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Link
              to="/automation"
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
                  Create Automation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAutomation; 