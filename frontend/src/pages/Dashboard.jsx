import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnalyticsSummary, getCampaigns, getAutomations, getInstagramAccounts } from '../api';
import {
  CubeIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  PhotoIcon,
  VideoCameraIcon,
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
  PlayIcon,
  PauseIcon,
  UserGroupIcon,
  HashtagIcon,
  MegaphoneIcon,
  SparklesIcon,
  PlusIcon,
  BoltIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [automations, setAutomations] = useState([]);
  const [instagramAccounts, setInstagramAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state for Recent Activity
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // Live Activity filtering state
  const [liveActivityFilter, setLiveActivityFilter] = useState('all');
  const [liveActivityGroup, setLiveActivityGroup] = useState('time');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, recentActivityRes, campaignsRes, automationsRes, instagramAccountsRes] = await Promise.all([
          getAnalyticsSummary(),
          getCampaigns(),
          getAutomations(),
          getInstagramAccounts()
        ]);

        setAnalytics(analyticsRes?.data || null);
        setRecentActivity(Array.isArray(recentActivityRes?.data) ? recentActivityRes.data : []);
        setCampaigns(Array.isArray(campaignsRes?.data) ? campaignsRes.data : []);
        setAutomations(Array.isArray(automationsRes?.data) ? automationsRes.data : []);
        setInstagramAccounts(Array.isArray(instagramAccountsRes?.data) ? instagramAccountsRes.data : []);
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
      change: '+12%',
      changeType: 'positive',
      icon: MegaphoneIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Automation Rules',
      value: automations?.length || 0,
      change: '+5%',
      changeType: 'positive',
      icon: CogIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Connected Accounts',
      value: instagramAccounts?.length || 0,
      change: '+2',
      changeType: 'positive',
      icon: UserGroupIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Engagement',
      value: analytics?.totalEngagement || 0,
      change: '+18%',
      changeType: 'positive',
      icon: HeartIcon,
      color: 'bg-pink-500'
    }
  ];

  // Pagination calculations for Recent Activity
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Live Activity data with filtering
  const liveActivityData = [
    {
      id: 1,
      type: 'automation',
      title: 'Automation triggered',
      description: 'Auto-reply sent to comment containing "product"',
      time: '2 min ago',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 2,
      type: 'follower',
      title: 'New follower',
      description: '@user123 started following your account',
      time: '5 min ago',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      icon: BellIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 3,
      type: 'campaign',
      title: 'Campaign scheduled',
      description: '"Summer Collection" post scheduled for tomorrow',
      time: '10 min ago',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      icon: ExclamationTriangleIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 4,
      type: 'engagement',
      title: 'High engagement post',
      description: 'Your latest post reached 1,000+ views',
      time: '15 min ago',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      icon: HeartIcon,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      id: 5,
      type: 'comment',
      title: 'New comment',
      description: 'Someone commented on your latest post',
      time: '20 min ago',
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      icon: ChatBubbleLeftIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 6,
      type: 'automation',
      title: 'Automation rule executed',
      description: 'Welcome message sent to new follower',
      time: '25 min ago',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 7,
      type: 'follower',
      title: 'Follower milestone',
      description: 'Reached 1,000 followers!',
      time: '1 hour ago',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      icon: BellIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 8,
      type: 'campaign',
      title: 'Campaign completed',
      description: '"Holiday Sale" campaign finished successfully',
      time: '2 hours ago',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: ExclamationTriangleIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  const filteredLiveActivity = liveActivityData.filter(activity => {
    if (liveActivityFilter === 'all') return true;
    return activity.type === liveActivityFilter;
  });

  const groupedLiveActivity = () => {
    const filtered = filteredLiveActivity;
    
    if (liveActivityGroup === 'time') {
      const groups = {
        'Just now': [],
        'Last 5 minutes': [],
        'Last 15 minutes': [],
        'Last hour': [],
        'Earlier today': []
      };
      
      filtered.forEach(activity => {
        const minutesAgo = Math.floor((Date.now() - activity.timestamp.getTime()) / (1000 * 60));
        
        if (minutesAgo <= 2) {
          groups['Just now'].push(activity);
        } else if (minutesAgo <= 5) {
          groups['Last 5 minutes'].push(activity);
        } else if (minutesAgo <= 15) {
          groups['Last 15 minutes'].push(activity);
        } else if (minutesAgo <= 60) {
          groups['Last hour'].push(activity);
        } else {
          groups['Earlier today'].push(activity);
        }
      });
      
      return groups;
    }
    
    if (liveActivityGroup === 'type') {
      const groups = {};
      filtered.forEach(activity => {
        if (!groups[activity.type]) {
          groups[activity.type] = [];
        }
        groups[activity.type].push(activity);
      });
      return groups;
    }
    
    return { 'All Activities': filtered };
  };

  // Better mock data for Recent Activity
  const mockRecentActivity = [
    {
      id: 1,
      type: 'campaign',
      description: 'Created new campaign "Summer Collection 2024"',
      status: 'completed',
      createdAt: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: 2,
      type: 'automation',
      description: 'Set up auto-reply rule for comments containing "price"',
      status: 'completed',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 3,
      type: 'post',
      description: 'Published post "New Product Launch" to Instagram',
      status: 'completed',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: 4,
      type: 'engagement',
      description: 'Reached 500+ likes on latest post',
      status: 'completed',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
    },
    {
      id: 5,
      type: 'follower',
      description: 'Gained 25 new followers today',
      status: 'completed',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
    },
    {
      id: 6,
      type: 'campaign',
      description: 'Scheduled "Weekend Sale" campaign for Saturday',
      status: 'pending',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
    },
    {
      id: 7,
      type: 'automation',
      description: 'Updated welcome message for new followers',
      status: 'completed',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: 8,
      type: 'post',
      description: 'Created story "Behind the Scenes"',
      status: 'completed',
      createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000)
    },
    {
      id: 9,
      type: 'engagement',
      description: 'Post reached 2,000+ impressions',
      status: 'completed',
      createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000)
    },
    {
      id: 10,
      type: 'campaign',
      description: 'Analyzed performance of "Spring Collection" campaign',
      status: 'completed',
      createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000)
    }
  ];

  // Use mock data if no real data
  const activityData = Array.isArray(recentActivity) && recentActivity.length > 0 ? recentActivity : mockRecentActivity;

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
              ) : (
                <ArrowDownIcon className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
              )}
              <span className={`ml-1 text-xs sm:text-sm font-medium ${
                card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
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
            to="/instagram-accounts"
            className="flex items-center p-4 sm:p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <UserGroupIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="font-medium text-gray-900 text-sm sm:text-base">Connect Account</p>
              <p className="text-xs sm:text-sm text-gray-500">Add Instagram account</p>
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

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Recent Activity</h3>
          <div className="space-y-3 sm:space-y-4">
            {activityData.slice(indexOfFirstItem, indexOfLastItem).length > 0 ? (
              activityData.slice(indexOfFirstItem, indexOfLastItem).map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 sm:space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-4 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">
                      {activity?.type || 'Activity'} - {activity?.description || 'No description'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {new Date(activity?.createdAt || Date.now()).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      activity?.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activity?.status || 'pending'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 sm:py-8">
                <ClockIcon className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">Your social media activities will appear here.</p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {activityData.length > itemsPerPage && (
            <div className="mt-4 sm:mt-6 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                <span className="text-xs sm:text-sm text-gray-700">
                  Page {currentPage} of {Math.ceil(activityData.length / itemsPerPage)}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === Math.ceil(activityData.length / itemsPerPage)}
                  className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Quick Stats</h3>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <EyeIcon className="h-4 w-5 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Total Views</p>
                  <p className="text-xs sm:text-sm text-gray-500">This week</p>
                </div>
              </div>
              <span className="text-base sm:text-lg font-semibold text-gray-900">12.5K</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <HeartIcon className="h-4 w-5 sm:h-5 sm:w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Total Likes</p>
                  <p className="text-xs sm:text-sm text-gray-500">This week</p>
                </div>
              </div>
              <span className="text-base sm:text-lg font-semibold text-gray-900">1.2K</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ChatBubbleLeftIcon className="h-4 w-5 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Total Comments</p>
                  <p className="text-xs sm:text-sm text-gray-500">This week</p>
                </div>
              </div>
              <span className="text-base sm:text-lg font-semibold text-gray-900">89</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ShareIcon className="h-4 w-5 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">Total Shares</p>
                  <p className="text-xs sm:text-sm text-gray-500">This week</p>
                </div>
              </div>
              <span className="text-base sm:text-lg font-semibold text-gray-900">23</span>
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
          to="/campaigns/new"
          className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Campaign
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.isArray(campaigns) && campaigns.length > 0 ? (
          campaigns.map((campaign) => (
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
                  Scheduled: {campaign?.scheduledDate ? new Date(campaign.scheduledDate).toLocaleDateString() : 'Not set'}
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
                to="/campaigns/new"
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
      {/* Filters and Grouping */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
            <FireIcon className="h-4 w-5 sm:h-5 sm:w-5 mr-2 text-orange-500" />
            Live Activity Feed
          </h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-3 w-4 sm:h-4 sm:w-4 text-gray-400" />
              <select
                value={liveActivityFilter}
                onChange={(e) => setLiveActivityFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-2 sm:px-3 py-1 text-xs sm:text-sm"
              >
                <option value="all">All Activities</option>
                <option value="automation">Automation</option>
                <option value="follower">Followers</option>
                <option value="campaign">Campaigns</option>
                <option value="engagement">Engagement</option>
                <option value="comment">Comments</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm text-gray-500">Group by:</span>
              <select
                value={liveActivityGroup}
                onChange={(e) => setLiveActivityGroup(e.target.value)}
                className="border border-gray-300 rounded-md px-2 sm:px-3 py-1 text-xs sm:text-sm"
              >
                <option value="time">Time</option>
                <option value="type">Type</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {Object.entries(groupedLiveActivity()).map(([groupName, activities]) => (
            <div key={groupName} className="space-y-3 sm:space-y-4">
              <h4 className="text-sm sm:text-md font-semibold text-gray-900">{groupName}</h4>
              {activities.map((activity) => (
                <div key={activity.id} className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 ${activity.bgColor} rounded-lg`}>
                  <activity.icon className={`h-4 w-5 sm:h-5 sm:w-5 ${activity.color}`} />
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{activity.description}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          ))}
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Social Media Dashboard</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm">Manage your Instagram campaigns and automation</p>
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
            <UserIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-2" />
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
};

export default Dashboard;

