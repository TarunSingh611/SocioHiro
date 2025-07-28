import React, { useState } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  HeartIcon, 
  UserPlusIcon, 
  SparklesIcon,
  LightBulbIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const ResponseMessageStep = ({ formData, setFormData }) => {
  const [showTemplates, setShowTemplates] = useState(false);

  const getActionDescription = () => {
    switch (formData.actionType) {
      case 'send_dm':
        return 'This message will be sent as a direct message to the user.';
      case 'reply_comment':
        return 'This message will be posted as a reply to the comment.';
      case 'send_story_reply':
        return 'This message will be sent as a reply to the story mention.';
      case 'like_comment':
        return 'This action will automatically like the comment.';
      case 'follow_user':
        return 'This action will follow the user back.';
      default:
        return 'This message will be used for the automation action.';
    }
  };

  const getPlaceholder = () => {
    switch (formData.actionType) {
      case 'send_dm':
        return 'Hi! Thanks for reaching out. Our team will get back to you within 24 hours.';
      case 'reply_comment':
        return 'Thanks for your comment! We appreciate your feedback.';
      case 'send_story_reply':
        return 'Thanks for mentioning us in your story!';
      case 'like_comment':
        return 'This action will automatically like the comment (no message needed).';
      case 'follow_user':
        return 'This action will follow the user back (no message needed).';
      default:
        return 'Enter your response message...';
    }
  };

  const getTemplates = () => {
    const baseTemplates = {
      send_dm: [
        {
          name: 'Customer Support',
          message: 'Hi! Thanks for reaching out. Our team will get back to you within 24 hours. In the meantime, check out our FAQ: [link]'
        },
        {
          name: 'Welcome Message',
          message: 'Welcome! 🎉 Thanks for following us. Check out our latest posts and stories!'
        },
        {
          name: 'Product Inquiry',
          message: 'Hi! Thanks for your interest in our products. You can find more details on our website: [link]'
        }
      ],
      reply_comment: [
        {
          name: 'Thank You',
          message: 'Thanks for your comment! We appreciate your feedback. 🙏'
        },
        {
          name: 'Engagement',
          message: 'Great point! Thanks for sharing your thoughts with us. 💭'
        },
        {
          name: 'Question Response',
          message: 'Great question! We\'ll address this in our next post. Stay tuned! 📝'
        }
      ],
      send_story_reply: [
        {
          name: 'Story Appreciation',
          message: 'Thanks for mentioning us in your story! We love seeing our community share our content. ❤️'
        },
        {
          name: 'Story Engagement',
          message: 'Amazing story! Thanks for the shoutout. 🙌'
        }
      ]
    };

    return baseTemplates[formData.actionType] || [];
  };

  const applyTemplate = (template) => {
    setFormData({ ...formData, responseMessage: template.message });
    setShowTemplates(false);
  };

  const isMessageRequired = () => {
    return ['send_dm', 'reply_comment', 'send_story_reply'].includes(formData.actionType);
  };

  const templates = getTemplates();

  return (
    <div className="space-y-6">
      {/* Action Type Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          {formData.actionType === 'send_dm' && <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600" />}
          {formData.actionType === 'like_comment' && <HeartIcon className="h-5 w-5 text-red-600" />}
          {formData.actionType === 'follow_user' && <UserPlusIcon className="h-5 w-5 text-green-600" />}
          {formData.actionType === 'reply_comment' && <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600" />}
          {formData.actionType === 'send_story_reply' && <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-600" />}
          
          <div>
            <h3 className="text-sm font-medium text-blue-900">
              {formData.actionType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h3>
            <p className="text-xs text-blue-700">{getActionDescription()}</p>
          </div>
        </div>
      </div>

      {/* Message Input */}
      {isMessageRequired() ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Response Message *
            </label>
            {templates.length > 0 && (
              <button
                type="button"
                onClick={() => setShowTemplates(!showTemplates)}
                className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200"
              >
                <SparklesIcon className="h-3 w-3 mr-1" />
                Templates
              </button>
            )}
          </div>

          {/* Templates */}
          {showTemplates && templates.length > 0 && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Choose a template:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {templates.map((template, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => applyTemplate(template)}
                    className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium text-sm text-gray-900">{template.name}</div>
                    <div className="text-xs text-gray-600 mt-1 line-clamp-2">{template.message}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <textarea
            value={formData.responseMessage}
            onChange={(e) => setFormData({ ...formData, responseMessage: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={getPlaceholder()}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {getActionDescription()}
          </p>
        </div>
      ) : (
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <HeartIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              No message required for this action
            </span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            This automation will perform the action automatically without sending a message.
          </p>
        </div>
      )}

      {/* Message Preview */}
      {isMessageRequired() && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Message Preview</h4>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            {formData.responseMessage ? (
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{formData.responseMessage}</p>
            ) : (
              <p className="text-sm text-gray-400 italic">Your message will appear here...</p>
            )}
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-yellow-50 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <LightBulbIcon className="h-5 w-5 text-yellow-600 mr-2" />
          <h4 className="text-sm font-medium text-yellow-800">
            Tips for better engagement
          </h4>
        </div>
        <ul className="text-xs text-yellow-700 space-y-1">
          <li>• Keep messages personal and friendly</li>
          <li>• Include relevant information or next steps</li>
          <li>• Use emojis sparingly to add personality</li>
          <li>• Keep it concise but helpful</li>
          <li>• Avoid spammy or overly promotional language</li>
          <li>• Respond within 24 hours for best engagement</li>
        </ul>
      </div>

      {/* Automation Timing */}
      <div className="bg-purple-50 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <ClockIcon className="h-5 w-5 text-purple-600 mr-2" />
          <h4 className="text-sm font-medium text-purple-800">
            Automation Timing
          </h4>
        </div>
        <div className="text-xs text-purple-700 space-y-1">
          <p>• This automation will trigger immediately when conditions are met</p>
          <p>• Rate limiting: {formData.cooldownMinutes || 5} minutes between executions per user</p>
          <p>• Daily limit: {formData.conditions.maxExecutionsPerDay || 10} executions per day</p>
          {formData.conditions.timeOfDay?.start && formData.conditions.timeOfDay?.end && (
            <p>• Time window: {formData.conditions.timeOfDay.start} - {formData.conditions.timeOfDay.end}</p>
          )}
        </div>
      </div>

      {/* Character Count */}
      {isMessageRequired() && (
        <div className="text-right">
          <span className={`text-xs ${
            formData.responseMessage.length > 200 ? 'text-red-600' : 'text-gray-500'
          }`}>
            {formData.responseMessage.length} characters
            {formData.responseMessage.length > 200 && ' (Instagram recommends under 200 characters)'}
          </span>
        </div>
      )}
    </div>
  );
};

export default ResponseMessageStep; 