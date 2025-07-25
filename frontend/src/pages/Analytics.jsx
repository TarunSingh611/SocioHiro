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
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const Analytics = () => {
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
        axios.get('/analytics/products'),
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
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
            <icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {value}
              </dd>
              {change && (
                <dd className="flex items-center text-sm">
                  {change > 0 ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Track your social media performance and insights</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mt-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getMetricCard(
          'Total Revenue',
          `$${analytics.summary.totalRevenue?.toFixed(2) || '0.00'}`,
          analytics.revenue.revenueGrowth,
          CurrencyDollarIcon,
          'bg-green-500'
        )}
        {getMetricCard(
          'Total Orders',
          analytics.summary.totalOrders || 0,
          null,
          ShoppingCartIcon,
          'bg-blue-500'
        )}
        {getMetricCard(
          'Total Products',
          analytics.summary.totalProducts || 0,
          null,
          ChartBarIcon,
          'bg-purple-500'
        )}
        {getMetricCard(
          'Engagement Rate',
          `${analytics.summary.engagementRate?.toFixed(1) || 0}%`,
          null,
          UserGroupIcon,
          'bg-yellow-500'
        )}
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Analytics */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Order Analytics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Average Order Value</span>
                <span className="text-sm font-medium text-gray-900">
                  ${analytics.orders.averageOrderValue?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Orders</span>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.orders.totalOrders || 0}
                </span>
              </div>
              {analytics.orders.statusBreakdown && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Status Breakdown</h4>
                  <div className="space-y-2">
                    {Object.entries(analytics.orders.statusBreakdown).map(([status, count]) => (
                      <div key={status} className="flex justify-between text-sm">
                        <span className="capitalize">{status}</span>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Analytics */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Product Analytics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Products</span>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.products.totalProducts || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Active Products</span>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.products.activeProducts || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Out of Stock</span>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.products.outOfStockProducts || 0}
                </span>
              </div>
              {analytics.products.topSellingProducts && analytics.products.topSellingProducts.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Top Selling Products</h4>
                  <div className="space-y-2">
                    {analytics.products.topSellingProducts.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="truncate">{item.product.title}</span>
                        <span>{item.sales} sold</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Engagement Analytics */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Engagement Analytics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Posts</span>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.engagement.totalPosts || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Stories</span>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.engagement.totalStories || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Likes</span>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.engagement.totalLikes || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Comments</span>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.engagement.totalComments || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Engagement Rate</span>
                <span className="text-sm font-medium text-gray-900">
                  {analytics.engagement.averageEngagementRate?.toFixed(1) || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Revenue Analytics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Revenue</span>
                <span className="text-sm font-medium text-gray-900">
                  ${analytics.revenue.totalRevenue?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Average Order Value</span>
                <span className="text-sm font-medium text-gray-900">
                  ${analytics.revenue.averageOrderValue?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Revenue Growth</span>
                <span className={`text-sm font-medium ${
                  analytics.revenue.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {analytics.revenue.revenueGrowth?.toFixed(1) || 0}%
                </span>
              </div>
              {analytics.revenue.revenueByStatus && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Revenue by Status</h4>
                  <div className="space-y-2">
                    {Object.entries(analytics.revenue.revenueByStatus).map(([status, revenue]) => (
                      <div key={status} className="flex justify-between text-sm">
                        <span className="capitalize">{status}</span>
                        <span>${revenue.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 