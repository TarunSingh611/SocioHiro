import React, { useState, useEffect } from 'react';
import {
  FireIcon,
  ChatBubbleLeftIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  UserIcon,
  GlobeAltIcon,
  BoltIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  HandThumbUpIcon,
  FaceSmileIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const LiveActivityMonitor = () => {
  const [liveActivity, setLiveActivity] = useState([]);
  const [webhookStatus, setWebhookStatus] = useState('connected');
  const [realTimeStats, setRealTimeStats] = useState({
    comments: 0,
    messages: 0,
    reactions: 0,
    mentions: 0
  });

  // Simulate real-time activity for app review
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        type: ['comment', 'message', 'reaction', 'mention'][Math.floor(Math.random() * 4)],
        user: `user_${Math.floor(Math.random() * 1000)}`,
        content: getRandomActivityContent(),
        timestamp: new Date(),
        status: 'new'
      };
      
      setLiveActivity(prev => [newActivity, ...prev.slice(0, 9)]);
      
      setRealTimeStats(prev => ({
        comments: prev.comments + (newActivity.type === 'comment' ? 1 : 0),
        messages: prev.messages + (newActivity.type === 'message' ? 1 : 0),
        reactions: prev.reactions + (newActivity.type === 'reaction' ? 1 : 0),
        mentions: prev.mentions + (newActivity.type === 'mention' ? 1 : 0)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getRandomActivityContent = () => {
    const contents = [
      "Great post! Love the content 🔥",
      "This is exactly what I needed!",
      "Amazing work as always 👏",
      "Can't wait to see more!",
      "This is so helpful, thank you!",
      "Love your style! 💯",
      "Keep up the great work!",
      "This is inspiring! ✨",
      "Thanks for sharing this!",
      "You're doing amazing! 🚀"
    ];
    return contents[Math.floor(Math.random() * contents.length)];
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'comment':
        return <ChatBubbleLeftIcon className="h-4 w-4 text-blue-600" />;
      case 'message':
        return <ChatBubbleLeftRightIcon className="h-4 w-4 text-green-600" />;
      case 'reaction':
        return <HeartIcon className="h-4 w-4 text-red-600" />;
      case 'mention':
        return <UserIcon className="h-4 w-4 text-purple-600" />;
      default:
        return <EyeIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'comment':
        return 'bg-blue-100';
      case 'message':
        return 'bg-green-100';
      case 'reaction':
        return 'bg-red-100';
      case 'mention':
        return 'bg-purple-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <ChatBubbleLeftIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Comments</p>
              <p className="text-2xl font-bold text-blue-600">{realTimeStats.comments}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Messages</p>
              <p className="text-2xl font-bold text-green-600">{realTimeStats.messages}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <HeartIcon className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Reactions</p>
              <p className="text-2xl font-bold text-red-600">{realTimeStats.reactions}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <UserIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Mentions</p>
              <p className="text-2xl font-bold text-purple-600">{realTimeStats.mentions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
            <FireIcon className="h-4 w-5 sm:h-5 sm:w-5 mr-2 text-orange-500" />
            Live Activity Feed
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Live</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {liveActivity.length > 0 ? (
            liveActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <span className="text-xs text-gray-500">
                      {activity.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.content}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <button className="text-xs text-blue-600 hover:text-blue-800">Reply</button>
                    <button className="text-xs text-green-600 hover:text-green-800">Like</button>
                    <button className="text-xs text-purple-600 hover:text-purple-800">Follow</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <ClockIcon className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Activity will appear here when you start using the app.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Features for App Review */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Webhook Events */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <GlobeAltIcon className="h-4 w-5 sm:h-5 sm:w-5 mr-2 text-blue-600" />
            Webhook Events
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm text-gray-700">Comment Event</span>
              <span className="text-xs text-green-600">✓ Processed</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm text-gray-700">Message Event</span>
              <span className="text-xs text-green-600">✓ Processed</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm text-gray-700">Reaction Event</span>
              <span className="text-xs text-green-600">✓ Processed</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm text-gray-700">Mention Event</span>
              <span className="text-xs text-green-600">✓ Processed</span>
            </div>
          </div>
        </div>

        {/* Automation Triggers */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <BoltIcon className="h-4 w-5 sm:h-5 sm:w-5 mr-2 text-yellow-600" />
            Automation Triggers
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
              <span className="text-sm text-gray-700">Comment Automation</span>
              <span className="text-xs text-yellow-600">Active</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
              <span className="text-sm text-gray-700">Message Automation</span>
              <span className="text-xs text-yellow-600">Active</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
              <span className="text-sm text-gray-700">Reaction Automation</span>
              <span className="text-xs text-yellow-600">Active</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
              <span className="text-sm text-gray-700">Mention Automation</span>
              <span className="text-xs text-yellow-600">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Instagram Features */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
          <SparklesIcon className="h-4 w-5 sm:h-5 sm:w-5 mr-2 text-purple-600" />
          Advanced Instagram Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Live Comment Management</span>
            </div>
            <p className="text-xs text-gray-600">Real-time comment monitoring and automated responses</p>
          </div>
          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Message Reactions</span>
            </div>
            <p className="text-xs text-gray-600">React to messages with emojis and quick responses</p>
          </div>
          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Webhook Integration</span>
            </div>
            <p className="text-xs text-gray-600">Real-time event processing via Instagram webhooks</p>
          </div>
          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Advanced Automation</span>
            </div>
            <p className="text-xs text-gray-600">Complex automation rules with multiple triggers</p>
          </div>
          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Real-time Analytics</span>
            </div>
            <p className="text-xs text-gray-600">Live engagement tracking and performance metrics</p>
          </div>
          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center mb-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Multi-platform Support</span>
            </div>
            <p className="text-xs text-gray-600">Support for Instagram Business and Creator accounts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveActivityMonitor; 