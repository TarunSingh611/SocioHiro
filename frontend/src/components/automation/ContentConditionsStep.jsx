import React, { useState } from 'react';
import { 
  PhotoIcon, 
  VideoCameraIcon, 
  PlayIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import ContentCard from '../content/ContentCard';

const ContentConditionsStep = ({ formData, setFormData, content, selectedContent, setSelectedContent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const dayOptions = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];

  const timeOptions = [
    { value: '00:00', label: '12:00 AM' },
    { value: '06:00', label: '6:00 AM' },
    { value: '09:00', label: '9:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '18:00', label: '6:00 PM' },
    { value: '21:00', label: '9:00 PM' },
    { value: '23:59', label: '11:59 PM' }
  ];

  const getMediaTypeIcon = (mediaType) => {
    switch (mediaType) {
      case 'IMAGE': return PhotoIcon;
      case 'VIDEO': return VideoCameraIcon;
      case 'CAROUSEL_ALBUM': return PlayIcon;
      default: return PhotoIcon;
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  // Ensure content is always an array and handle null/undefined cases
  const contentArray = Array.isArray(content) ? content : [];
  
  const filteredContent = contentArray.filter(item => {
    if (!item) return false;
    
    const matchesSearch = item.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.instagramId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.mediaType === filterType;
    return matchesSearch && matchesFilter;
  });


  const handleContentSelection = (contentItem) => {
    if (selectedContent?._id === contentItem._id) {
      setSelectedContent(null);
    } else {
      setSelectedContent(contentItem);
    }
  };

  const handleDayToggle = (dayValue) => {
    const currentDays = formData.conditions.daysOfWeek || [];
    const newDays = currentDays.includes(dayValue)
      ? currentDays.filter(d => d !== dayValue)
      : [...currentDays, dayValue];
    
    handleInputChange('conditions.daysOfWeek', newDays);
  };

  return (
    <div className="space-y-8">
      {/* Content Selection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Select specific content (optional)
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setSelectedContent(null)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                !selectedContent
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              All Content
            </button>
            <button
              type="button"
              onClick={() => setFilterType(filterType === 'all' ? 'IMAGE' : 'all')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                filterType !== 'all'
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              <FunnelIcon className="h-3 w-3 inline mr-1" />
              Filter
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search content by caption or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {filterType !== 'all' && (
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-xs text-gray-500">Filtering by:</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                {filterType}
              </span>
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {filteredContent?.map((item) => {
            const Icon = getMediaTypeIcon(item.mediaType);
            const isSelected = selectedContent?._id === item._id;
            
            return (
              <div
                key={item._id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleContentSelection(item)}
              >
                <ContentCard content={item} />
              </div>
            );
          })}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <PhotoIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No content found matching your search criteria.</p>
            {contentArray.length === 0 && (
              <p className="text-sm text-gray-400 mt-2">No content available to select from.</p>
            )}
          </div>
        )}
      </div>

      {/* Advanced Conditions */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Conditions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Time Restrictions */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <ClockIcon className="h-4 w-4 mr-2" />
              Time Restrictions
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                <select
                  value={formData.conditions.timeOfDay?.start || ''}
                  onChange={(e) => handleInputChange('conditions.timeOfDay.start', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No restriction</option>
                  {timeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">End Time</label>
                <select
                  value={formData.conditions.timeOfDay?.end || ''}
                  onChange={(e) => handleInputChange('conditions.timeOfDay.end', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No restriction</option>
                  {timeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Day Restrictions */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Day Restrictions
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {dayOptions.map(day => (
                <label key={day.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.conditions.daysOfWeek?.includes(day.value) || false}
                    onChange={() => handleDayToggle(day.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-xs text-gray-700">{day.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* User Restrictions */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <UserIcon className="h-4 w-4 mr-2" />
            User Restrictions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Min Follower Count</label>
              <input
                type="number"
                value={formData.conditions.userFollowerCount?.min || ''}
                onChange={(e) => handleInputChange('conditions.userFollowerCount.min', parseInt(e.target.value) || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="No minimum"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max Follower Count</label>
              <input
                type="number"
                value={formData.conditions.userFollowerCount?.max || ''}
                onChange={(e) => handleInputChange('conditions.userFollowerCount.max', parseInt(e.target.value) || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="No maximum"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.conditions.requireVerifiedUser || false}
                onChange={(e) => handleInputChange('conditions.requireVerifiedUser', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 flex items-center">
                <ShieldCheckIcon className="h-4 w-4 mr-1" />
                Only verified users
              </span>
            </label>
          </div>
        </div>

        {/* Rate Limiting */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Rate Limiting</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max Executions/Day</label>
              <input
                type="number"
                value={formData.conditions.maxExecutionsPerDay || 100000}
                onChange={(e) => handleInputChange('conditions.maxExecutionsPerDay', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Cooldown (minutes)</label>
              <input
                type="number"
                value={formData.cooldownMinutes || 0}
                onChange={(e) => setFormData({ ...formData, cooldownMinutes: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max Executions/User</label>
              <input
                type="number"
                value={formData.maxExecutionsPerUser || 10}
                onChange={(e) => setFormData({ ...formData, maxExecutionsPerUser: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Automation Summary</h4>
        <div className="text-xs text-blue-800 space-y-1">
          <p>• Content: {selectedContent ? `Specific post (${selectedContent.instagramId})` : 'All content'}</p>
          <p>• Time: {formData.conditions.timeOfDay?.start && formData.conditions.timeOfDay?.end 
            ? `${formData.conditions.timeOfDay.start} - ${formData.conditions.timeOfDay.end}` 
            : 'No time restrictions'}</p>
          <p>• Days: {formData.conditions.daysOfWeek?.length > 0 
            ? formData.conditions.daysOfWeek.map(d => dayOptions[d].label).join(', ')
            : 'All days'}</p>
          <p>• Rate Limit: {formData.conditions.maxExecutionsPerDay} executions/day, {formData.cooldownMinutes}min cooldown</p>
        </div>
      </div>
    </div>
  );
};

export default ContentConditionsStep; 