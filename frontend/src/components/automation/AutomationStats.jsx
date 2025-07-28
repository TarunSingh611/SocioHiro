import React from 'react';
import {
  ChatBubbleLeftRightIcon,
  PlayIcon,
  ChartBarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const AutomationStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center">
          <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
            <ChatBubbleLeftRightIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <div className="ml-3 sm:ml-4">
            <p className="text-xs sm:text-sm font-medium text-gray-600">Total Automations</p>
            <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats.totalAutomations}</p>
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
              {stats.activeAutomations}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center">
          <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
            <ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
          </div>
          <div className="ml-3 sm:ml-4">
            <p className="text-xs sm:text-sm font-medium text-gray-600">Total Executions</p>
            <p className="text-lg sm:text-2xl font-semibold text-gray-900">
              {stats.totalExecutions}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center">
          <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
            <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
          </div>
          <div className="ml-3 sm:ml-4">
            <p className="text-xs sm:text-sm font-medium text-gray-600">Success Rate</p>
            <p className="text-lg sm:text-2xl font-semibold text-gray-900">
              {stats.totalExecutions > 0 ? Math.round((stats.successfulExecutions / stats.totalExecutions) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationStats; 