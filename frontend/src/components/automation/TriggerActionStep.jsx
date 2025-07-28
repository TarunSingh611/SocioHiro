import React from 'react';
import {
  ChatBubbleLeftRightIcon,
  EyeIcon,
  CheckCircleIcon,
  HeartIcon,
  UserPlusIcon,
  HashtagIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const TriggerActionStep = ({ formData, setFormData }) => {
  const triggerOptions = [
    {
      value: 'comment',
      label: 'Comment',
      icon: ChatBubbleLeftRightIcon,
      description: 'When someone comments on your post',
      compatibleActions: ['send_dm', 'like_comment', 'reply_comment']
    },
    {
      value: 'dm',
      label: 'Direct Message',
      icon: ChatBubbleLeftRightIcon,
      description: 'When someone sends you a DM',
      compatibleActions: ['send_dm']
    },
    {
      value: 'mention',
      label: 'Mention',
      icon: ChatBubbleLeftRightIcon,
      description: 'When someone mentions you',
      compatibleActions: ['send_dm', 'follow_user']
    },
    {
      value: 'like',
      label: 'Like',
      icon: HeartIcon,
      description: 'When someone likes your post',
      compatibleActions: ['send_dm', 'follow_user']
    },
    {
      value: 'follow',
      label: 'Follow',
      icon: UserPlusIcon,
      description: 'When someone follows you',
      compatibleActions: ['send_dm', 'follow_user']
    },
    {
      value: 'hashtag',
      label: 'Hashtag',
      icon: HashtagIcon,
      description: 'When someone uses a specific hashtag',
      compatibleActions: ['send_dm', 'follow_user']
    }
  ];

  const actionOptions = [
    {
      value: 'send_dm',
      label: 'Send Direct Message',
      icon: ChatBubbleLeftRightIcon,
      description: 'Send a personalized DM',
      compatibleTriggers: ['comment', 'dm', 'mention', 'like', 'follow', 'hashtag']
    },
    {
      value: 'like_comment',
      label: 'Like Comment',
      icon: HeartIcon,
      description: 'Automatically like the comment',
      compatibleTriggers: ['comment']
    },
    {
      value: 'reply_comment',
      label: 'Reply to Comment',
      icon: ChatBubbleLeftRightIcon,
      description: 'Post a reply to the comment',
      compatibleTriggers: ['comment']
    },
    {
      value: 'follow_user',
      label: 'Follow User',
      icon: UserPlusIcon,
      description: 'Follow the user back',
      compatibleTriggers: ['mention', 'like', 'follow', 'hashtag']
    },
    {
      value: 'send_story_reply',
      label: 'Send Story Reply',
      icon: ChatBubbleLeftRightIcon,
      description: 'Reply to a story mention',
      compatibleTriggers: ['mention']
    }
  ];

  // Get compatible actions for selected trigger
  const getCompatibleActions = (triggerType) => {
    const trigger = triggerOptions.find(t => t.value === triggerType);
    return trigger ? trigger.compatibleActions : [];
  };

  // Get compatible triggers for selected action
  const getCompatibleTriggers = (actionType) => {
    const action = actionOptions.find(a => a.value === actionType);
    return action ? action.compatibleTriggers : [];
  };

  const handleTriggerChange = (triggerType) => {
    // Reset action if it's not compatible with new trigger
    const compatibleActions = getCompatibleActions(triggerType);
    const newActionType = compatibleActions.includes(formData.actionType)
      ? formData.actionType
      : compatibleActions[0] || 'send_dm';

    setFormData({
      ...formData,
      triggerType,
      actionType: newActionType
    });
  };

  const handleActionChange = (actionType) => {
    setFormData({
      ...formData,
      actionType
    });
  };

  const compatibleActions = getCompatibleActions(formData.triggerType);
  const compatibleTriggers = getCompatibleTriggers(formData.actionType);

  return (
    <div className="space-y-8">
      {/* Multiple Triggers Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          What should trigger this automation? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {triggerOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.triggerType === option.value;
            const isCompatible = compatibleTriggers.includes(option.value);

            return (
              <div
                key={option.value}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : isCompatible
                    ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                }`}
                onClick={() => isCompatible && handleTriggerChange(option.value)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      isSelected ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      isSelected ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {option.label}
                    </h4>
                    <p className={`text-sm ${
                      isSelected ? 'text-blue-700' : 'text-gray-500'
                    }`}>
                      {option.description}
                    </p>
                  </div>
                  {isSelected && (
                    <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Multiple Actions Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          What action should be performed? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actionOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.actionType === option.value;
            const isCompatible = compatibleActions.includes(option.value);

            return (
              <div
                key={option.value}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                    : isCompatible
                    ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                }`}
                onClick={() => isCompatible && handleActionChange(option.value)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      isSelected ? 'text-green-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      isSelected ? 'text-green-900' : 'text-gray-900'
                    }`}>
                      {option.label}
                    </h4>
                    <p className={`text-sm ${
                      isSelected ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {option.description}
                    </p>
                  </div>
                  {isSelected && (
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Keywords Section - Only show for text-based triggers */}
      {['comment', 'dm', 'mention', 'hashtag'].includes(formData.triggerType) && (
        <div className="bg-blue-50 rounded-lg p-4">
          <label className="block text-sm font-medium text-blue-700 mb-2">
            Keywords (optional)
          </label>
          <input
            type="text"
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., help, support, question (comma-separated)"
          />
          <p className="text-xs text-blue-600 mt-1">
            Only trigger when these keywords are present in the {formData.triggerType}
          </p>

          <div className="mt-3 flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.exactMatch}
                onChange={(e) => setFormData({ ...formData, exactMatch: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-blue-700">Exact match</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.caseSensitive}
                onChange={(e) => setFormData({ ...formData, caseSensitive: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-blue-700">Case sensitive</span>
            </label>
          </div>
        </div>
      )}

      {/* Compatibility Notice */}
      <div className="bg-yellow-50 rounded-lg p-4">
        <div className="flex items-center">
          <EyeIcon className="h-5 w-5 text-yellow-600 mr-2" />
          <span className="text-sm font-medium text-yellow-800">
            Compatibility Notice
          </span>
        </div>
        <p className="text-sm text-yellow-700 mt-1">
          Only compatible trigger-action combinations are shown. The system ensures that your automation will work correctly with Instagram's API.
        </p>
      </div>
    </div>
  );
};

export default TriggerActionStep; 