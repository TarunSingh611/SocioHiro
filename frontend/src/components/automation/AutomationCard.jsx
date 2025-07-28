import React from 'react';
import {
  PlayIcon,
  PauseIcon,
  TrashIcon,
  PencilIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  CheckCircleIcon,
  PhotoIcon,
  VideoCameraIcon,
  PlayIcon as PlayIconSolid,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const AutomationCard = ({ 
  automation, 
  isSelected, 
  onSelect, 
  onToggleStatus, 
  onTest, 
  onEdit, 
  onDelete 
}) => {
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

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getMediaTypeIcon = (mediaType) => {
    switch (mediaType) {
      case 'IMAGE': return PhotoIcon;
      case 'VIDEO': return VideoCameraIcon;
      case 'CAROUSEL_ALBUM': return PlayIconSolid;
      default: return PhotoIcon;
    }
  };

  const TriggerIcon = getTriggerIcon(automation.triggerType);
  const ActionIcon = getActionIcon(automation.actionType);

  // Check if automation applies to specific content or all content
  const isAppliedToSpecificContent = automation.contentId || automation.instagramMediaId;
  const isAppliedToAllContent = automation.applyToAllContent;

  return (
    <div className="p-4 sm:p-6 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center space-x-3 mb-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <div className="flex-1">
          <h4 className="text-sm sm:text-base font-medium text-gray-900">
            {automation.name}
          </h4>
          <p className="text-xs sm:text-sm text-gray-500">
            {automation.description}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gray-100 rounded-lg">
              <TriggerIcon className="h-4 w-4 text-gray-600" />
            </div>
            <span className="text-xs sm:text-sm text-gray-600">
              {automation.triggerType}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gray-100 rounded-lg">
              <ActionIcon className="h-4 w-4 text-gray-600" />
            </div>
            <span className="text-xs sm:text-sm text-gray-600">
              {automation.actionType.replace('_', ' ')}
            </span>
          </div>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(automation.isActive)}`}>
            {automation.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">
            {automation.executionCount || 0} executions
          </span>
          {automation.lastExecuted && (
            <span className="text-xs text-gray-500">
              Last: {new Date(automation.lastExecuted).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Content Application Section */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-700">Applied to:</span>
          <div className="flex items-center space-x-1">
            {isAppliedToAllContent && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                <GlobeAltIcon className="h-3 w-3 mr-1" />
                All Content
              </span>
            )}
            {isAppliedToSpecificContent && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                <PhotoIcon className="h-3 w-3 mr-1" />
                Specific Post
              </span>
            )}
          </div>
        </div>

        {/* Specific Content Details */}
        {isAppliedToSpecificContent && automation.contentId && (
          <div className="flex items-center space-x-2">
            {automation.contentId.instagramMediaType && (
              <div className="p-1 bg-gray-200 rounded">
                {(() => {
                  const MediaIcon = getMediaTypeIcon(automation.contentId.instagramMediaType);
                  return <MediaIcon className="h-3 w-3 text-gray-600" />;
                })()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-600 truncate">
                {automation.contentId.permalink ? (
                  <a 
                    href={automation.contentId.permalink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View on Instagram
                  </a>
                ) : (
                  `Post ID: ${automation.instagramMediaId || automation.contentId._id}`
                )}
              </p>
            </div>
          </div>
        )}

        {/* Keywords */}
        {automation.keywords && automation.keywords.length > 0 && (
          <div className="mt-2">
            <span className="text-xs text-gray-500">Keywords: </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {automation.keywords.slice(0, 3).map((keyword, index) => (
                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                  {keyword}
                </span>
              ))}
              {automation.keywords.length > 3 && (
                <span className="text-xs text-gray-500">+{automation.keywords.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        {/* Conditions Summary */}
        {(automation.conditions?.timeOfDay?.start || automation.conditions?.daysOfWeek?.length > 0) && (
          <div className="mt-2 pt-2 border-t border-gray-200">
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
      </div>
      
      <div className="mt-3 flex items-center space-x-2">
        <button
          onClick={() => onToggleStatus(automation._id, automation.isActive)}
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
          onClick={() => onTest(automation._id)}
          className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200"
        >
          <BoltIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-1" />
          Test
        </button>
        <button
          onClick={() => onEdit(automation)}
          className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <PencilIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-1" />
          Edit
        </button>
        <button
          onClick={() => onDelete(automation._id)}
          className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200"
        >
          <TrashIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-1" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default AutomationCard; 