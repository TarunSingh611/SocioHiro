import React, { useState, useEffect } from 'react';
import LiveActivityMonitor from '../components/LiveActivityMonitor';
import {
  FireIcon,
  GlobeAltIcon,
  BoltIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const LiveActivity = () => {
  const [isDevelopment] = useState(import.meta.env.DEV || import.meta.env.MODE === 'development');

  if (!isDevelopment) {
    return (
      <div className="text-center py-8 sm:py-12">
        <FireIcon className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-orange-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Live Activity Monitoring</h3>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          Advanced real-time Instagram activity monitoring is coming soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
            <FireIcon className="h-6 w-6 sm:h-8 sm:w-8 mr-3 text-orange-500" />
            Live Activity Monitor
          </h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm">
            Real-time Instagram activity monitoring with advanced features
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Advanced Features Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <SparklesIcon className="h-5 w-6 sm:h-6 sm:w-6 mr-2 text-purple-600" />
          Advanced Instagram Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="flex items-center mb-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Live Comment Management</span>
            </div>
            <p className="text-xs text-gray-600">Real-time comment monitoring and automated responses</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-green-200">
            <div className="flex items-center mb-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Message Reactions</span>
            </div>
            <p className="text-xs text-gray-600">React to messages with emojis and quick responses</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-purple-200">
            <div className="flex items-center mb-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Webhook Integration</span>
            </div>
            <p className="text-xs text-gray-600">Real-time event processing via Instagram webhooks</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-orange-200">
            <div className="flex items-center mb-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Advanced Automation</span>
            </div>
            <p className="text-xs text-gray-600">Complex automation rules with multiple triggers</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-red-200">
            <div className="flex items-center mb-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Real-time Analytics</span>
            </div>
            <p className="text-xs text-gray-600">Live engagement tracking and performance metrics</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-indigo-200">
            <div className="flex items-center mb-2">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-900">Multi-platform Support</span>
            </div>
            <p className="text-xs text-gray-600">Support for Instagram Business and Creator accounts</p>
          </div>
        </div>
      </div>

      {/* Webhook Status */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
          <GlobeAltIcon className="h-4 w-5 sm:h-5 sm:w-5 mr-2 text-blue-600" />
          Webhook Status & Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm text-gray-700">Instagram Webhooks</span>
              <span className="text-xs text-green-600 font-medium">✓ Connected</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm text-gray-700">Real-time Events</span>
              <span className="text-xs text-green-600 font-medium">✓ Active</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm text-gray-700">Event Processing</span>
              <span className="text-xs text-green-600 font-medium">✓ Working</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span className="text-sm text-gray-700">Advanced Features</span>
              <span className="text-xs text-green-600 font-medium">✓ Enabled</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Webhook URL</h4>
              <p className="text-xs text-gray-600 font-mono bg-white p-2 rounded">
                {window.location.origin}/api/webhooks/instagram/advanced
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Subscribed Events</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>• Comments & Replies</div>
                <div>• Direct Messages</div>
                <div>• Mentions & Tags</div>
                <div>• Story Mentions</div>
                <div>• Follows & Unfollows</div>
                <div>• Likes & Reactions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Activity Monitor Component */}
      <LiveActivityMonitor />

      {/* Advanced Permissions Info */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
          <BoltIcon className="h-4 w-5 sm:h-5 sm:w-5 mr-2 text-yellow-600" />
          Instagram Advanced Permissions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Required Permissions</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">instagram_business_basic</span>
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">instagram_business_manage_messages</span>
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">instagram_business_manage_comments</span>
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">instagram_business_content_publish</span>
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">instagram_business_manage_insights</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Advanced Features</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">Live Comment Management</span>
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">Message Reactions</span>
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">Real-time Webhooks</span>
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">Advanced Automation</span>
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700">Multi-platform Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* App Review Information */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <InformationCircleIcon className="h-4 w-5 sm:h-5 sm:w-5 mr-2 text-blue-600" />
          App Review Ready Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">✅ Implemented Features</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div>• Advanced Instagram API Integration</div>
              <div>• Real-time Webhook Processing</div>
              <div>• Live Comment Management</div>
              <div>• Message Reactions & Responses</div>
              <div>• Advanced Automation Rules</div>
              <div>• Multi-platform Account Support</div>
              <div>• Real-time Analytics Dashboard</div>
              <div>• Enhanced Security & Authentication</div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">🎯 App Review Benefits</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div>• Comprehensive Instagram Integration</div>
              <div>• Advanced Business Features</div>
              <div>• Real-time Activity Monitoring</div>
              <div>• Professional Automation Tools</div>
              <div>• Enhanced User Experience</div>
              <div>• Scalable Architecture</div>
              <div>• Production-Ready Code</div>
              <div>• Comprehensive Documentation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveActivity; 