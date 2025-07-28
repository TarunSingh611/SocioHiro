import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  HeartIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  PlayIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import useContentStore from '../store/contentStore';

const Analytics = () => {
  const { getAnalyticsStats } = useContentStore();
  const contentStats = getAnalyticsStats();
  
  const [analytics, setAnalytics] = useState({
    summary: {},
    orders: {},
    products: {},
    engagement: {},
    revenue: {}
  });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('monthly');

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      const [summaryRes, ordersRes, productsRes, engagementRes, revenueRes] = await Promise.all([
        axios.get('/analytics/summary'),
        axios.get('/analytics/orders'),
        axios.get('/analytics/engagement'),
        axios.get('/analytics/revenue')
      ]);

      setAnalytics({
        summary: summaryRes.data,
        orders: ordersRes.data,
        products: productsRes.data,
        engagement: engagementRes.data,
        revenue: revenueRes.data
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMetricCard = (title, value, change, icon, color) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-4 sm:p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-2 sm:p-3 ${color}`}>
            <icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="ml-3 sm:ml-5 w-0 flex-1">
            <dl>
              <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-base sm:text-lg font-medium text-gray-900">
                {value}
              </dd>
              {change && (
                <dd className="flex items-center text-xs sm:text-sm">
                  {change > 0 ? (
                    <ArrowUpIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                  )}
                  <span className={`ml-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(change)}%
                  </span>
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm">Track your social media performance</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Content Analytics Section */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Content Analytics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {getMetricCard(
            'Total Likes',
            (contentStats?.totalLikes || 0).toLocaleString(),
            null,
            HeartIcon,
            'bg-pink-500'
          )}
          {getMetricCard(
            'Total Comments',
            (contentStats?.totalComments || 0).toLocaleString(),
            null,
            ChatBubbleLeftIcon,
            'bg-purple-500'
          )}
          {getMetricCard(
            'Total Shares',
            (contentStats?.totalShares || 0).toLocaleString(),
            null,
            ShareIcon,
            'bg-green-500'
          )}
          {getMetricCard(
            'Total Reach',
            (contentStats?.totalReach || 0).toLocaleString(),
            null,
            EyeIcon,
            'bg-indigo-500'
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6">
          {getMetricCard(
            'Total Impressions',
            (contentStats?.totalImpressions || 0).toLocaleString(),
            null,
            EyeIcon,
            'bg-cyan-500'
          )}
          {getMetricCard(
            'Total Saved',
            (contentStats?.totalSaved || 0).toLocaleString(),
            null,
            HeartIcon,
            'bg-red-500'
          )}
          {getMetricCard(
            'Avg Engagement',
            `${(contentStats?.avgEngagementRate || 0).toFixed(1)}%`,
            null,
            ChartBarIcon,
            'bg-emerald-500'
          )}
          {getMetricCard(
            'Posts',
            contentStats?.posts || 0,
            null,
            PhotoIcon,
            'bg-blue-500'
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-4 sm:mt-6">
          {getMetricCard(
            'Reels',
            contentStats?.reels || 0,
            null,
            PlayIcon,
            'bg-orange-500'
          )}
          {getMetricCard(
            'Stories',
            contentStats?.stories || 0,
            null,
            PhotoIcon,
            'bg-purple-500'
          )}
          {getMetricCard(
            'High Performing',
            contentStats?.highPerforming || 0,
            null,
            ChartBarIcon,
            'bg-green-500'
          )}
          {getMetricCard(
            'Underperforming',
            contentStats?.underperforming || 0,
            null,
            ChartBarIcon,
            'bg-red-500'
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {getMetricCard(
          'Total Followers',
          '12.5K',
          '+12%',
          UserGroupIcon,
          'bg-blue-500'
        )}
        {getMetricCard(
          'Engagement Rate',
          '4.2%',
          '+8%',
          ChartBarIcon,
          'bg-green-500'
        )}
        {getMetricCard(
          'Reach',
          '45.2K',
          '+15%',
          CurrencyDollarIcon,
          'bg-purple-500'
        )}
        {getMetricCard(
          'Impressions',
          '89.1K',
          '+5%',
          ShoppingCartIcon,
          'bg-yellow-500'
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Chart */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Engagement Over Time</h3>
          <div className="h-64 sm:h-80 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Chart will be displayed here</p>
            </div>
          </div>
        </div>

        {/* Reach Chart */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Reach & Impressions</h3>
          <div className="h-64 sm:h-80 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Chart will be displayed here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Posts */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Top Performing Posts</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Post #{item} - Amazing content that performed well
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {item * 1000} likes • {item * 100} comments • {item * 50} shares
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    +{item * 15}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Demographics */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Audience Demographics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Age 18-24</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 sm:w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">35%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Age 25-34</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 sm:w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '28%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">28%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Age 35-44</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 sm:w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '22%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">22%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Age 45+</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 sm:w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">15%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Link
            to="/campaigns"
            className="flex items-center p-4 sm:p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="font-medium text-gray-900 text-sm sm:text-base">View Campaigns</p>
              <p className="text-xs sm:text-sm text-gray-500">Analyze campaign performance</p>
            </div>
          </Link>
          <Link
            to="/instagram-accounts"
            className="flex items-center p-4 sm:p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <UserGroupIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="font-medium text-gray-900 text-sm sm:text-base">Account Insights</p>
              <p className="text-xs sm:text-sm text-gray-500">View account analytics</p>
            </div>
          </Link>
          <Link
            to="/content"
            className="flex items-center p-4 sm:p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="font-medium text-gray-900 text-sm sm:text-base">Content Analytics</p>
              <p className="text-xs sm:text-sm text-gray-500">Track content performance</p>
            </div>
          </Link>
          <Link
            to="/automation"
            className="flex items-center p-4 sm:p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
              <ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="font-medium text-gray-900 text-sm sm:text-base">Automation Stats</p>
              <p className="text-xs sm:text-sm text-gray-500">View automation metrics</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 