import React from 'react';
import {
  PhotoIcon,
  CheckCircleIcon,
  ClockIcon,
  HeartIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  ChartBarIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

const ContentStats = ({ stats, content = [] }) => {
  // Calculate stats from content data with null checking
  const calculateStats = () => {
    const totalContent = content?.length || 0;
    const published = content?.filter(item => item?.isPublished)?.length || 0;
    const scheduled = content?.filter(item => !item?.isPublished && item?.scheduledDate)?.length || 0;
    const drafts = content?.filter(item => !item?.isPublished && !item?.scheduledDate)?.length || 0;
    
    // Calculate engagement metrics
    const totalLikes = content?.reduce((sum, item) => sum + (item?.stats?.likes || 0), 0) || 0;
    const totalComments = content?.reduce((sum, item) => sum + (item?.stats?.comments || 0), 0) || 0;
    const totalShares = content?.reduce((sum, item) => sum + (item?.stats?.shares || 0), 0) || 0;
    const totalReach = content?.reduce((sum, item) => sum + (item?.stats?.reach || 0), 0) || 0;
    const totalImpressions = content?.reduce((sum, item) => sum + (item?.stats?.impressions || 0), 0) || 0;
    const totalSaved = content?.reduce((sum, item) => sum + (item?.stats?.saved || 0), 0) || 0;
    
    // Calculate average engagement rate
    const totalEngagement = totalLikes + totalComments + totalShares;
    const avgEngagementRate = totalReach > 0 ? (totalEngagement / totalReach) * 100 : 0;
    
    // Count content types
    const posts = content?.filter(item => item?.type === 'post')?.length || 0;
    const reels = content?.filter(item => item?.type === 'reel')?.length || 0;
    const stories = content?.filter(item => item?.type === 'story')?.length || 0;
    
    // Count performance categories
    const highPerforming = content?.filter(item => item?.performance?.isHighPerforming)?.length || 0;
    const underperforming = content?.filter(item => item?.performance?.isUnderperforming)?.length || 0;
    
    return {
      totalContent,
      published,
      scheduled,
      drafts,
      totalLikes,
      totalComments,
      totalShares,
      totalReach,
      totalImpressions,
      totalSaved,
      avgEngagementRate,
      posts,
      reels,
      stories,
      highPerforming,
      underperforming
    };
  };

  const calculatedStats = calculateStats();
  
  // Use calculated stats if no stats prop provided, otherwise merge
  const displayStats = stats ? { ...calculatedStats, ...stats } : calculatedStats;

  const statCards = [
    {
      id: 'total',
      label: 'Total Content',
      value: displayStats?.totalContent || 0,
      icon: PhotoIcon,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 'published',
      label: 'Published',
      value: displayStats?.published || 0,
      icon: CheckCircleIcon,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 'scheduled',
      label: 'Scheduled',
      value: displayStats?.scheduled || 0,
      icon: ClockIcon,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      id: 'likes',
      label: 'Total Likes',
      value: (displayStats?.totalLikes || 0).toLocaleString(),
      icon: HeartIcon,
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-600'
    },
    {
      id: 'comments',
      label: 'Total Comments',
      value: (displayStats?.totalComments || 0).toLocaleString(),
      icon: ChatBubbleLeftIcon,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      id: 'reach',
      label: 'Total Reach',
      value: (displayStats?.totalReach || 0).toLocaleString(),
      icon: EyeIcon,
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    },
    {
      id: 'engagement',
      label: 'Avg Engagement',
      value: `${(displayStats?.avgEngagementRate || 0).toFixed(1)}%`,
      icon: ChartBarIcon,
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    {
      id: 'reels',
      label: 'Reels',
      value: displayStats?.reels || 0,
      icon: PlayIcon,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
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