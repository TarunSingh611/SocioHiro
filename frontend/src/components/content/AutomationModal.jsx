import React from 'react';
import {
  XMarkIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  CheckCircleIcon,
  GlobeAltIcon,
  PhotoIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';

const AutomationModal = ({ isOpen, onClose, automations, content }) => {
  if (!isOpen) return null;

  const getTriggerIcon = (triggerType) => {
    switch (triggerType) {
      case 'comment': return ChatBubbleLeftRightIcon;
      case 'dm': return ChatBubbleLeftRightIcon;
      case 'mention': return ChatBubbleLeftRightIcon;
      case 'like': return EyeIcon;
      case 'follow': return CheckCircleIcon;
      case 'hashtag': return ChatBubbleLeftRightIcon;
      default: return ChatBubbleLeftRightIcon;
    }
  };

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'send_dm': return ChatBubbleLeftRightIcon;
      case 'like_comment': return EyeIcon;
      case 'reply_comment': return ChatBubbleLeftRightIcon;
      case 'follow_user': return CheckCircleIcon;
      case 'send_story_reply': return ChatBubbleLeftRightIcon;
      default: return BoltIcon;
    }
  };

  const getMediaTypeIcon = (mediaType) => {
    switch (mediaType) {
      case 'IMAGE': return PhotoIcon;
      case 'VIDEO': return PlayIcon;
      case 'CAROUSEL_ALBUM': return PlayIcon;
      default: return PhotoIcon;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Automations</h2>
            <p className="text-sm text-gray-500">
              Automations applied to this content
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {automations && automations.length > 0 ? (
            <div className="space-y-4">
              {automations.map((automation, index) => {
                const TriggerIcon = getTriggerIcon(automation.triggerType);
                const ActionIcon = getActionIcon(automation.actionType);
                const isAllContentAutomation = !automation.contentId || automation.applyToAllContent;

                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {automation.name || `Automation ${index + 1}`}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          automation.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {automation.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {isAllContentAutomation && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                            <GlobeAltIcon className="h-3 w-3 mr-1" />
                            All Content
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {automation.executionCount > 0 && (
                          <span className="text-xs text-blue-600 font-medium">
                            {automation.executionCount} executions
                          </span>
                        )}
                        <button className="text-gray-400 hover:text-gray-600">
                          <PauseIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Trigger and Action */}
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <TriggerIcon className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="text-sm text-gray-600 capitalize">
                          {automation.triggerType}
                        </span>
                      </div>
                      <div className="text-gray-400">→</div>
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <ActionIcon className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="text-sm text-gray-600">
                          {automation.actionType?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Keywords */}
                    {automation.keywords && automation.keywords.length > 0 && (
                      <div className="mb-3">
                        <span className="text-xs text-gray-500">Keywords: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {automation.keywords.map((keyword, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Response Message */}
                    {automation.responseMessage && (
                      <div className="mb-3">
                        <span className="text-xs text-gray-500">Response: </span>
                        <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded">
                          {automation.responseMessage}
                        </p>
                      </div>
                    )}

                    {/* Conditions */}
                    {(automation.conditions?.timeOfDay?.start || automation.conditions?.daysOfWeek?.length > 0) && (
                      <div className="mb-3">
                        <span className="text-xs text-gray-500">Conditions: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {automation.conditions.timeOfDay?.start && automation.conditions.timeOfDay?.end && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                              {automation.conditions.timeOfDay.start}-{automation.conditions.timeOfDay.end}
                            </span>
                          )}
                          {automation.conditions.daysOfWeek?.length > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">
                              {automation.conditions.daysOfWeek.length} days
                            </span>
                          )}
                          {automation.conditions.requireVerifiedUser && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700">
                              Verified only
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-2 pt-3 border-t border-gray-200">
                      <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200">
                        Edit
                      </button>
                      <button className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200">
                        Test
                      </button>
                      <button className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200">
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <BoltIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-gray-900 mb-2">No automations</h3>
              <p className="text-sm text-gray-500 mb-4">
                No automations are currently applied to this content.
              </p>
              <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Create Automation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutomationModal; 