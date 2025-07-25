import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  ChatBubbleLeftRightIcon,
  PlayIcon,
  PauseIcon,
  TrashIcon,
  PencilIcon,
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Automation = () => {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: 'comment',
    condition: 'contains',
    keywords: '',
    response: '',
    isActive: true
  });

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    try {
      // Mock data for now
      const mockAutomations = [
        {
          id: 1,
          name: 'Welcome New Followers',
          description: 'Automatically welcome new followers with a personalized message',
          trigger: 'follow',
          condition: 'new_follower',
          keywords: '',
          response: 'Welcome! Thanks for following us! 🎉',
          isActive: true,
          executions: 45,
          lastExecuted: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          name: 'Comment Response',
          description: 'Respond to comments containing specific keywords',
          trigger: 'comment',
          condition: 'contains',
          keywords: 'question, help, support',
          response: 'Thanks for your comment! We\'ll get back to you soon.',
          isActive: true,
          executions: 23,
          lastExecuted: '2024-01-14T15:45:00Z'
        },
        {
          id: 3,
          name: 'Post Engagement',
          description: 'Like and comment on posts with specific hashtags',
          trigger: 'hashtag',
          condition: 'contains',
          keywords: '#ourbrand, #product',
          response: 'Great post! Thanks for sharing! 👍',
          isActive: false,
          executions: 12,
          lastExecuted: '2024-01-13T09:20:00Z'
        }
      ];
      setAutomations(mockAutomations);
    } catch (error) {
      console.error('Error fetching automations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAutomation) {
        // Update existing automation
        setAutomations(prev => prev.map(acc => 
          acc.id === editingAutomation.id 
            ? { ...acc, ...formData }
            : acc
        ));
      } else {
        // Create new automation
        const newAutomation = {
          id: Date.now(),
          ...formData,
          executions: 0,
          lastExecuted: null
        };
        setAutomations(prev => [...prev, newAutomation]);
      }
      setShowAddModal(false);
      setEditingAutomation(null);
      resetForm();
    } catch (error) {
      console.error('Error saving automation:', error);
    }
  };

  const handleEdit = (automation) => {
    setEditingAutomation(automation);
    setFormData({
      name: automation.name || '',
      description: automation.description || '',
      trigger: automation.trigger || 'comment',
      condition: automation.condition || 'contains',
      keywords: automation.keywords || '',
      response: automation.response || '',
      isActive: automation.isActive !== false
    });
    setShowAddModal(true);
  };

  const handleDelete = async (automationId) => {
    if (window.confirm('Are you sure you want to delete this automation?')) {
      try {
        setAutomations(prev => prev.filter(acc => acc.id !== automationId));
      } catch (error) {
        console.error('Error deleting automation:', error);
      }
    }
  };

  const handleToggleStatus = async (automationId, currentStatus) => {
    try {
      setAutomations(prev => prev.map(acc => 
        acc.id === automationId 
          ? { ...acc, isActive: !currentStatus }
          : acc
      ));
    } catch (error) {
      console.error('Error toggling automation status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      trigger: 'comment',
      condition: 'contains',
      keywords: '',
      response: '',
      isActive: true
    });
  };

  const getTriggerIcon = (trigger) => {
    switch (trigger) {
      case 'follow': return CheckCircleIcon;
      case 'comment': return ChatBubbleLeftRightIcon;
      case 'hashtag': return ChatBubbleLeftRightIcon;
      case 'mention': return ChatBubbleLeftRightIcon;
      default: return ChatBubbleLeftRightIcon;
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Automation</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm">Manage your automated responses and actions</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Link
            to="/automation/new"
            className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-2" />
            New Automation
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
              <ChatBubbleLeftRightIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Automations</p>
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">{automations.length}</p>
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
                {automations.filter(acc => acc.isActive).length}
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
                {automations.filter(acc => !acc.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
              <ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Executions</p>
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                {automations.reduce((sum, acc) => sum + (acc.executions || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Automations List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">All Automations</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {automations.length > 0 ? (
            automations.map((automation) => {
              const TriggerIcon = getTriggerIcon(automation.trigger);
              return (
                <div key={automation.id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="flex-shrink-0">
                        <div className="p-2 sm:p-3 bg-gray-100 rounded-lg">
                          <TriggerIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                          {automation.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">
                          {automation.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(automation.isActive)}`}>
                            {automation.isActive ? 'Active' : 'Paused'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {automation.executions} executions
                          </span>
                          {automation.lastExecuted && (
                            <span className="text-xs text-gray-500">
                              Last: {new Date(automation.lastExecuted).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <button
                        onClick={() => handleToggleStatus(automation.id, automation.isActive)}
                        className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-md ${
                          automation.isActive
                            ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200'
                            : 'text-green-700 bg-green-100 hover:bg-green-200'
                        }`}
                      >
                        {automation.isActive ? (
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
                        onClick={() => handleEdit(automation)}
                        className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        <PencilIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(automation.id)}
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
              <ChatBubbleLeftRightIcon className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No automations</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">Create your first automation to get started.</p>
              <div className="mt-6">
                <Link
                  to="/automation/new"
                  className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent shadow-sm text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-2" />
                  Create Automation
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
                {editingAutomation ? 'Edit Automation' : 'Create New Automation'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Automation Name
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
                      Trigger
                    </label>
                    <select
                      value={formData.trigger}
                      onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="comment">Comment</option>
                      <option value="follow">New Follower</option>
                      <option value="hashtag">Hashtag</option>
                      <option value="mention">Mention</option>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Condition
                    </label>
                    <select
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="contains">Contains</option>
                      <option value="equals">Equals</option>
                      <option value="starts_with">Starts with</option>
                      <option value="ends_with">Ends with</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Response
                  </label>
                  <textarea
                    value={formData.response}
                    onChange={(e) => setFormData({ ...formData, response: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your automated response..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-xs sm:text-sm text-gray-900">
                    Active
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingAutomation(null);
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
                    {editingAutomation ? 'Update Automation' : 'Create Automation'}
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

export default Automation; 