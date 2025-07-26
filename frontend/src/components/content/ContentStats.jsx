import React from 'react';
import {
  PhotoIcon,
  CheckCircleIcon,
  ClockIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const ContentStats = ({ stats }) => {
  const statCards = [
    {
      id: 'total',
      label: 'Total Content',
      value: stats?.totalContent || 0,
      icon: PhotoIcon,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 'published',
      label: 'Published',
      value: stats?.published || 0,
      icon: CheckCircleIcon,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 'scheduled',
      label: 'Scheduled',
      value: stats?.scheduled || 0,
      icon: ClockIcon,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      id: 'likes',
      label: 'Total Likes',
      value: stats?.totalLikes?.toLocaleString() || '0',
      icon: HeartIcon,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.id} className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className={`p-2 sm:p-3 ${stat.bgColor} rounded-lg`}>
                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContentStats; 