import React, { useState, useMemo } from 'react';
import {
  ChartBarIcon,
  CalendarIcon,
  FunnelIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

const ContentAnalytics = ({ content = [] }) => {
  const [timeFilter, setTimeFilter] = useState('week');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [metricFilter, setMetricFilter] = useState('engagement');

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    const now = new Date();
    const timeRanges = {
      day: 1,
      week: 7,
      month: 30,
      year: 365
    };

    const filteredContent = content.filter(item => {
      if (!item.publishedAt) return false;
      
      const publishedDate = new Date(item.publishedAt);
      const daysDiff = (now - publishedDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= timeRanges[timeFilter];
    });

    // Filter by content type
    const typeFiltered = contentTypeFilter === 'all' 
      ? filteredContent 
      : filteredContent.filter(item => item.type === contentTypeFilter);

    // Calculate metrics
    const metrics = {
      totalContent: typeFiltered.length,
      totalLikes: typeFiltered.reduce((sum, item) => sum + (item.stats?.likes || 0), 0),
      totalComments: typeFiltered.reduce((sum, item) => sum + (item.stats?.comments || 0), 0),
      totalShares: typeFiltered.reduce((sum, item) => sum + (item.stats?.shares || 0), 0),
      totalSaved: typeFiltered.reduce((sum, item) => sum + (item.stats?.saved || 0), 0),
      totalReach: typeFiltered.reduce((sum, item) => sum + (item.insights?.reach || 0), 0),
      totalImpressions: typeFiltered.reduce((sum, item) => sum + (item.insights?.impressions || 0), 0),
      avgEngagement: 0,
      highPerforming: typeFiltered.filter(item => item.performance?.isHighPerforming).length,
      underperforming: typeFiltered.filter(item => item.performance?.isUnderperforming).length
    };

    // Calculate average engagement rate
    if (metrics.totalReach > 0) {
      const totalEngagement = metrics.totalLikes + metrics.totalComments + metrics.totalShares;
      metrics.avgEngagement = (totalEngagement / metrics.totalReach) * 100;
    }

    return metrics;
  }, [content, timeFilter, contentTypeFilter]);

  // Generate chart data
  const chartData = useMemo(() => {
    const now = new Date();
    const days = timeFilter === 'day' ? 24 : timeFilter === 'week' ? 7 : timeFilter === 'month' ? 30 : 365;
    
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const dayContent = content.filter(item => {
        if (!item.publishedAt) return false;
        const publishedDate = new Date(item.publishedAt);
        return publishedDate.toDateString() === date.toDateString();
      });

      const dayMetrics = {
        date: date.toLocaleDateString(),
        likes: dayContent.reduce((sum, item) => sum + (item.stats?.likes || 0), 0),
        comments: dayContent.reduce((sum, item) => sum + (item.stats?.comments || 0), 0),
        shares: dayContent.reduce((sum, item) => sum + (item.stats?.shares || 0), 0),
        reach: dayContent.reduce((sum, item) => sum + (item.insights?.reach || 0), 0),
        engagement: 0
      };

      if (dayMetrics.reach > 0) {
        dayMetrics.engagement = ((dayMetrics.likes + dayMetrics.comments + dayMetrics.shares) / dayMetrics.reach) * 100;
      }

      data.push(dayMetrics);
    }

    return data;
  }, [content, timeFilter]);

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getMetricValue = () => {
    switch (metricFilter) {
      case 'likes': return analyticsData.totalLikes;
      case 'comments': return analyticsData.totalComments;
      case 'shares': return analyticsData.totalShares;
      case 'reach': return analyticsData.totalReach;
      case 'engagement': return analyticsData.avgEngagement;
      default: return analyticsData.totalLikes;
    }
  };

  const getMetricIcon = () => {
    switch (metricFilter) {
      case 'likes': return HeartIcon;
      case 'comments': return ChatBubbleLeftIcon;
      case 'shares': return ShareIcon;
      case 'reach': return EyeIcon;
      case 'engagement': return ChartBarIcon;
      default: return HeartIcon;
    }
  };

  const MetricIcon = getMetricIcon();

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-4 w-4 text-gray-500" />
            <select
              value={contentTypeFilter}
              onChange={(e) => setContentTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Content</option>
              <option value="post">Posts</option>
              <option value="reel">Reels</option>
              <option value="story">Stories</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <ChartBarIcon className="h-4 w-4 text-gray-500" />
            <select
              value={metricFilter}
              onChange={(e) => setMetricFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="engagement">Engagement Rate</option>
              <option value="likes">Likes</option>
              <option value="comments">Comments</option>
              <option value="shares">Shares</option>
              <option value="reach">Reach</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Content</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalContent}</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Likes</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.totalLikes)}</p>
            </div>
            <HeartIcon className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Engagement</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.avgEngagement.toFixed(1)}%</p>
            </div>
            <ArrowTrendingUpIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Performing</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.highPerforming}</p>
            </div>
            <ArrowTrendingUpIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Performance Over Time</h3>
          <div className="flex items-center space-x-2">
            <MetricIcon className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {metricFilter.charAt(0).toUpperCase() + metricFilter.slice(1)}
            </span>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="h-64 flex items-end justify-between space-x-1">
          {chartData.map((data, index) => {
            const maxValue = Math.max(...chartData.map(d => getMetricValue()));
            const height = maxValue > 0 ? (getMetricValue() / maxValue) * 100 : 0;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-500 mt-1">{data.date}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">High Performing</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(analyticsData.highPerforming / analyticsData.totalContent) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{analyticsData.highPerforming}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Underperforming</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${(analyticsData.underperforming / analyticsData.totalContent) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{analyticsData.underperforming}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HeartIcon className="h-4 w-4 text-red-500" />
                <span className="text-sm text-gray-600">Likes</span>
              </div>
              <span className="text-sm font-medium">{formatNumber(analyticsData.totalLikes)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ChatBubbleLeftIcon className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600">Comments</span>
              </div>
              <span className="text-sm font-medium">{formatNumber(analyticsData.totalComments)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShareIcon className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Shares</span>
              </div>
              <span className="text-sm font-medium">{formatNumber(analyticsData.totalShares)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookmarkIcon className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-600">Saved</span>
              </div>
              <span className="text-sm font-medium">{formatNumber(analyticsData.totalSaved)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentAnalytics; 