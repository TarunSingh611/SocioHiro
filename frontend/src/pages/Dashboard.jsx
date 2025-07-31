import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnalyticsSummary, getCampaigns, getAutomations, getAnalyticsEngagement, getAnalyticsRevenue } from '../api';
import WorkInProgress from '../components/WorkInProgress';
import {
  CalendarIcon,
  PhotoIcon,
  FireIcon,
  CogIcon,
  BellIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MegaphoneIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, campaignsRes, automationsRes] = await Promise.all([
          getAnalyticsSummary(),
          getCampaigns(),
          getAutomations()
        ]);

        setAnalytics(analyticsRes?.data || null);
        setCampaigns(Array.isArray(campaignsRes?.data) ? campaignsRes.data : []);
        setAutomations(Array.isArray(automationsRes?.data) ? automationsRes.data : []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: EyeIcon },
    { id: 'campaigns', name: 'Campaigns', icon: MegaphoneIcon },
    { id: 'live', name: 'Live Activity', icon: FireIcon }
  ];

  const statsCards = [
    {
      title: 'Active Campaigns',
      value: campaigns?.length || 0,
      change: campaigns?.length > 0 ? `${campaigns.length} active` : 'No campaigns',
      changeType: campaigns?.length > 0 ? 'positive' : 'neutral',
      icon: MegaphoneIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Automation Rules',
      value: automations?.length || 0,
      change: automations?.length > 0 ? `${automations.length} active` : 'No automations',
      changeType: automations?.length > 0 ? 'positive' : 'neutral',
      icon: CogIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Total Posts',
      value: analytics?.totalPosts || 0,
      change: analytics?.totalPosts > 0 ? `${analytics.totalPosts} published` : 'No posts',
      changeType: analytics?.totalPosts > 0 ? 'positive' : 'neutral',
      icon: PhotoIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Engagement',
      value: analytics?.totalEngagement || 0,
      change: analytics?.totalEngagement > 0 ? `${analytics.totalEngagement} total` : 'No engagement',
      changeType: analytics?.totalEngagement > 0 ? 'positive' : 'neutral',
      icon: HeartIcon,
      color: 'bg-pink-500'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className={`p-2 sm:p-3 rounded-full ${card.color} bg-opacity-10`}>
                <card.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${card.color.replace('bg-', 'text-')}`} />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900">{card.value}</p>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center">
              {card.changeType === 'positive' ? (
                <ArrowUpIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
              ) : card.changeType === 'negative' ? (
                <ArrowDownIcon className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
              ) : (
                <span className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400">—</span>
              )}
              <span className={`ml-1 text-xs sm:text-sm font-medium ${
                card.changeType === 'positive' ? 'text-green-600' : 
                card.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-8">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Link
            to="/campaigns"
            className="flex items-center p-4 sm:p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <MegaphoneIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="font-medium text-gray-900 text-sm sm:text-base">View Campaigns</p>
              <p className="text-xs sm:text-sm text-gray-500">Manage your campaigns</p>
            </div>
          </Link>
          <Link
            to="/automation"
            className="flex items-center p-4 sm:p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <CogIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="font-medium text-gray-900 text-sm sm:text-base">View Automation</p>
              <p className="text-xs sm:text-sm text-gray-500">Manage automation rules</p>
            </div>
          </Link>
          <Link
            to="/analytics"
            className="flex items-center p-4 sm:p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="p-2 sm:p-3 bg-pink-100 rounded-lg group-hover:bg-pink-200 transition-colors">
              <EyeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="font-medium text-gray-900 text-sm sm:text-base">View Analytics</p>
              <p className="text-xs sm:text-sm text-gray-500">Track performance</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Real Analytics Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Status */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Account Status</h3>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MegaphoneIcon className="h-4 w-5 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Active Campaigns</p>
                  <p className="text-xs sm:text-sm text-gray-500">Running campaigns</p>
                </div>
              </div>
              <span className="text-base sm:text-lg font-semibold text-gray-900">{campaigns?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CogIcon className="h-4 w-5 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Automation Rules</p>
                  <p className="text-xs sm:text-sm text-gray-500">Active automations</p>
                </div>
              </div>
              <span className="text-base sm:text-lg font-semibold text-gray-900">{automations?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <PhotoIcon className="h-4 w-5 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Total Posts</p>
                  <p className="text-xs sm:text-sm text-gray-500">Published content</p>
                </div>
              </div>
              <span className="text-base sm:text-lg font-semibold text-gray-900">{analytics?.totalPosts || 0}</span>
            </div>
          </div>
        </div>

        {/* Engagement Summary */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Engagement Summary</h3>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <HeartIcon className="h-4 w-5 sm:h-5 sm:w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Total Engagement</p>
                  <p className="text-xs sm:text-sm text-gray-500">Likes, comments, shares</p>
                </div>
              </div>
              <span className="text-base sm:text-lg font-semibold text-gray-900">{analytics?.totalEngagement || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <EyeIcon className="h-4 w-5 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Total Posts</p>
                  <p className="text-xs sm:text-sm text-gray-500">Published content</p>
                </div>
              </div>
              <span className="text-base sm:text-lg font-semibold text-gray-900">{analytics?.totalPosts || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShareIcon className="h-4 w-5 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Avg Engagement Rate</p>
                  <p className="text-xs sm:text-sm text-gray-500">Per post average</p>
                </div>
              </div>
              <span className="text-base sm:text-lg font-semibold text-gray-900">
                {analytics?.avgEngagementRate ? `${analytics.avgEngagementRate.toFixed(1)}%` : '0%'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCampaigns = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Active Campaigns</h3>
          <p className="text-gray-500 text-sm">Manage your social media campaigns</p>
        </div>
        <Link
          to="/campaigns"
          className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          View All Campaigns
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.isArray(campaigns) && campaigns.length > 0 ? (
          campaigns.slice(0, 6).map((campaign) => (
            <div key={campaign?._id} className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">{campaign?.name || 'Untitled Campaign'}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  campaign?.status === 'active' ? 'bg-green-100 text-green-800' : 
                  campaign?.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {campaign?.status || 'draft'}
                </span>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">{campaign?.description || 'No description'}</p>
              <div className="space-y-2">
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  {campaign?.scheduledDate ? new Date(campaign.scheduledDate).toLocaleDateString() : 'No date set'}
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <EyeIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Reach: {campaign?.reach || 0}
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <HeartIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Engagement: {campaign?.engagement || 0}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 sm:py-12">
            <MegaphoneIcon className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns</h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">Get started by creating your first campaign.</p>
            <div className="mt-4 sm:mt-6">
              <Link
                to="/campaigns"
                className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Campaign
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderLive = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
            <FireIcon className="h-4 w-5 sm:h-5 sm:w-5 mr-2 text-orange-500" />
            Recent Activity
          </h3>
        </div>
        
        <div className="space-y-4">
          <div className="text-center py-8">
            <ClockIcon className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Activity will appear here when you start using the app.
            </p>
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

  if (error) {
    return (
      <div className="text-center py-8 sm:py-12">
        <ExclamationTriangleIcon className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading dashboard</h3>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  // Show Work in Progress component
  if (!isDevelopment) {
    return (
    <WorkInProgress
      title="Dashboard"
      subtitle="Enhanced dashboard with real-time data and beautiful UI is coming soon! We're building a comprehensive overview of your social media management."
      features={[
        {
          icon: <EyeIcon className="w-6 h-6 text-blue-600" />,
          title: "Real-time Overview",
          description: "Get instant insights into your social media performance"
        },
        {
          icon: <HeartIcon className="w-6 h-6 text-pink-600" />,
          title: "Engagement Analytics",
          description: "Track likes, comments, shares, and engagement rates"
        },
        {
          icon: <MegaphoneIcon className="w-6 h-6 text-green-600" />,
          title: "Campaign Management",
          description: "Monitor active campaigns and their performance"
        },
        {
          icon: <CogIcon className="w-6 h-6 text-purple-600" />,
          title: "Automation Insights",
          description: "Track automation rules and their execution status"
        },
        {
          icon: <PhotoIcon className="w-6 h-6 text-orange-600" />,
          title: "Content Performance",
          description: "Analyze which content types perform best"
        },
        {
          icon: <FireIcon className="w-6 h-6 text-red-600" />,
          title: "Live Activity",
          description: "See real-time activity and recent updates"
        }
      ]}
    />
    );
  }
  else{
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm">Overview of your social media management</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Link
              to="/content"
              className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <PhotoIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-2" />
              View Content
            </Link>
            <Link
              to="/account-settings"
              className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <CogIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-2" />
              Account Settings
            </Link>
          </div>
        </div>
  
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-5 sm:h-5 sm:w-5 inline mr-1 sm:mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
  
        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'campaigns' && renderCampaigns()}
          {activeTab === 'live' && renderLive()}
        </div>
      </div>
    );
  }
};

export default Dashboard;

