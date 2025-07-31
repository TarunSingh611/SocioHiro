import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  UserIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  GlobeAltIcon,
  ClockIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  PhotoIcon,
  SparklesIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import useUserStore from '../store/userStore';
import LogoutModal from '../components/LogoutModal';
import SessionLimitModal from '../components/SessionLimitModal';
import { getCurrentInstagramAccount, getInstagramConnectionStatus } from '../api';

const AccountSettings = () => {
  const navigate = useNavigate();
  const { logout, logoutAllDevices, getSessionStatus, getActiveSessions, getRecentSessions, removeSession } = useUserStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const navRef = React.useRef(null);

  // Instagram profile data (real data from API)
  const [instagramProfile, setInstagramProfile] = useState(null);
  const [instagramLoading, setInstagramLoading] = useState(true);
  const [instagramError, setInstagramError] = useState(null);

  // Fetch Instagram profile data

  const fetchInstagramProfile = async () => {
    try {
      setInstagramLoading(true);
      setInstagramError(null);
      
      // First check connection status
      const connectionStatus = await getInstagramConnectionStatus();
      if (connectionStatus?.data?.isConnected) {
        // Fetch current Instagram account data
        const accountData = await getCurrentInstagramAccount();
        if(accountData?.data){
          setInstagramProfile(accountData?.data);
        }else{
          setInstagramProfile(null);
        }
      } else {
        setInstagramProfile(null);
      }
    } catch (error) {
      console.error('Failed to fetch Instagram profile:', error);
      setInstagramError('Failed to load Instagram profile data');
      setInstagramProfile(null);
    } finally {
      setInstagramLoading(false);
    }
  };

  useEffect(() => {
    fetchInstagramProfile();
  }, []);

  // Fetch session information on component mount
  useEffect(() => {
    const fetchSessionInfo = async () => {
      try {
        const session = await getSessionStatus();
        if (session) {
          setSessionInfo(session);
        }
      } catch (error) {
        console.error('Failed to fetch session info:', error);
      }
    };

    const fetchActiveSessions = async () => {
      try {
        setSessionLoading(true);
        const sessions = await getActiveSessions();
        setActiveSessions(sessions || []);
      } catch (error) {
        console.error('Failed to fetch active sessions:', error);
        setActiveSessions([]);
      } finally {
        setSessionLoading(false);
      }
    };

    const fetchRecentSessions = async () => {
      try {
        setRecentSessionsLoading(true);
        const sessions = await getRecentSessions();
        setRecentSessions(sessions || []);
      } catch (error) {
        console.error('Failed to fetch recent sessions:', error);
        setRecentSessions([]);
      } finally {
        setRecentSessionsLoading(false);
      }
    };

    fetchSessionInfo();
    fetchActiveSessions();
    fetchRecentSessions();
  }, [getSessionStatus, getActiveSessions, getRecentSessions]);

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    campaignUpdates: true,
    automationAlerts: true,
    weeklyReports: false,
    securityAlerts: true
  });

  const [subscriptionData, setSubscriptionData] = useState({
    currentPlan: 'Free Plan',
    planPrice: 'Limited Time Offer',
    nextBillingDate: null,
    features: [
      'Unlimited campaigns',
      'Unlimited automations',
      'Unlimited content posts',
      'Advanced analytics',
      'Priority support',
      'Custom integrations'
    ]
  });

  const [sessionInfo, setSessionInfo] = useState({
    isActive: false,
    lastLoginAt: null,
    lastLogoutAt: null,
    sessionCount: 0,
    hasInstagramToken: false,
    activeSessions: 0,
    maxConcurrentSessions: 5
  });

  const [activeSessions, setActiveSessions] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [recentSessionsLoading, setRecentSessionsLoading] = useState(false);
  const [showSessionLimitModal, setShowSessionLimitModal] = useState(false);

  const [newTicket, setNewTicket] = useState({
    title: '',
    type: 'support',
    priority: 'medium',
    description: ''
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'session', name: 'Session', icon: InformationCircleIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'subscription', name: 'Subscription', icon: CreditCardIcon },
    { id: 'tickets', name: 'Tickets', icon: QuestionMarkCircleIcon },
    { id: 'help', name: 'Help & Support', icon: InformationCircleIcon }
  ];

  const handleNotificationToggle = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLogoutLoading(false);
      setShowLogoutModal(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleLogoutAllDevices = async () => {
    setLogoutLoading(true);
    try {
      await logoutAllDevices();
      navigate('/login');
    } catch (error) {
      console.error('Logout all devices failed:', error);
    } finally {
      setLogoutLoading(false);
      setShowLogoutModal(false);
    }
  };

  const handleRemoveSession = async (sessionId) => {
    try {
      const success = await removeSession(sessionId);
      if (success) {
        // Refresh active sessions and recent sessions
        const [activeSessions, recentSessions] = await Promise.all([
          getActiveSessions(),
          getRecentSessions()
        ]);
        setActiveSessions(activeSessions);
        setRecentSessions(recentSessions);
        setMessage({ type: 'success', text: 'Session removed successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Failed to remove session:', error);
      setMessage({ type: 'error', text: 'Failed to remove session' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const getDeviceIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'ios':
      case 'android':
        return <DevicePhoneMobileIcon className="h-4 w-4" />;
      case 'ipad':
        return <DeviceTabletIcon className="h-4 w-4" />;
      default:
        return <ComputerDesktopIcon className="h-4 w-4" />;
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const checkScrollButtons = () => {
    if (navRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollTo = (direction) => {
    if (navRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = navRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      navRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    checkScrollButtons();
  };

  React.useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <PhotoIcon className="h-6 w-6 text-pink-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Instagram Profile</h3>
          </div>
          {!instagramLoading && (
            <button
              onClick={async () => {
                try {
                  setInstagramLoading(true);
                  setInstagramError(null);
                  fetchInstagramProfile();

                } catch (error) {
                  console.error('Failed to refresh Instagram profile:', error);
                  setInstagramError('Failed to refresh Instagram profile data');
                } finally {
                  setInstagramLoading(false);
                }
              }}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          )}
        </div>
        
        {instagramLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading Instagram profile...</p>
          </div>
        ) : instagramError ? (
          <div className="text-center py-4 text-red-600">
            <ExclamationTriangleIcon className="h-6 w-6 mx-auto mb-2" />
            <p>{instagramError}</p>
          </div>
        ) : instagramProfile ? (
          <>
            <div className="flex items-start space-x-6 mb-6">
              <img 
                src={instagramProfile?.profilePic || 'https://via.placeholder.com/150'} 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover border-4 border-gray-100"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-xl font-bold text-gray-900">{instagramProfile?.username || 'N/A'}</h4>
                  {instagramProfile?.isVerified && (
                    <SparklesIcon className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <p className="text-gray-600 mb-2">{instagramProfile?.fullName || 'N/A'}</p>
                <p className="text-sm text-gray-500 mb-3">{instagramProfile?.bio || 'N/A'}</p>
                <div className="flex space-x-6 text-sm">
                  <span><strong>{instagramProfile?.posts || 'N/A'}</strong> posts</span>
                  <span><strong>{instagramProfile?.followers || 'N/A'}</strong> followers</span>
                  <span><strong>{instagramProfile?.following || 'N/A'}</strong> following</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {instagramProfile?.accountType || 'N/A'}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Connected {instagramProfile?.connectedAt ? new Date(instagramProfile.connectedAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                <p className="text-sm text-blue-800">
                  This profile information is synced from your Instagram account and cannot be edited here. 
                  To update your profile, please make changes directly on Instagram.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No Instagram account connected or profile data available.</p>
            <p>Please connect your Instagram account in the Security section.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderSessionInfo = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Session Information</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Session Status</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              sessionInfo?.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {sessionInfo?.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Active Sessions</span>
            <span className="text-sm text-gray-900">
              {sessionInfo?.activeSessions || 0} / {sessionInfo?.maxConcurrentSessions || 5}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Instagram Token</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              sessionInfo?.hasInstagramToken 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {sessionInfo?.hasInstagramToken ? 'Connected' : 'Not Connected'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total Sessions</span>
            <span className="text-sm text-gray-900">{sessionInfo?.sessionCount || 0}</span>
          </div>
          
          {sessionInfo?.lastLoginAt && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Last Login</span>
              <span className="text-sm text-gray-900">
                {new Date(sessionInfo?.lastLoginAt).toLocaleString()}
              </span>
            </div>
          )}
          
          {sessionInfo?.lastLogoutAt && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Last Logout</span>
              <span className="text-sm text-gray-900">
                {new Date(sessionInfo?.lastLogoutAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Active Devices</h3>
          <button
            onClick={handleLogoutAllDevices}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout All Devices
          </button>
        </div>
        
        {sessionLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading sessions...</p>
          </div>
        ) : activeSessions.length > 0 ? (
          <div className="space-y-4">
            {activeSessions.filter(session => session && session.sessionId).map((session) => (
              <div key={session.sessionId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                                              <span className="text-sm font-medium text-gray-900">
                          {session.deviceInfo?.browser || 'Unknown'} on {session.deviceInfo?.platform || 'Unknown'}
                        </span>
                      {session.isCurrentSession && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      IP: {session.deviceInfo?.ipAddress || 'Unknown'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Last activity: {session.lastActivityAt ? new Date(session.lastActivityAt).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                  {!session.isCurrentSession && (
                    <button
                      onClick={() => handleRemoveSession(session.sessionId)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No active sessions found</p>
          </div>
        )}
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Sessions</h3>
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500">Last 10 sessions</span>
          </div>
        </div>
        
        {recentSessionsLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading recent sessions...</p>
          </div>
        ) : recentSessions && recentSessions.length > 0 ? (
          <div className="space-y-3">
            {recentSessions.filter(session => session && session.sessionId).map((session) => (
              <div key={session.sessionId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="flex-shrink-0">
                      {getDeviceIcon(session.deviceInfo?.platform)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {session.deviceInfo?.browser || 'Unknown'} on {session.deviceInfo?.platform || 'Unknown'}
                        </p>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          {formatDuration(session.duration)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        IP: {session.deviceInfo?.ipAddress || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session.loginAt ? new Date(session.loginAt).toLocaleDateString() : 'N/A'} - {session.logoutAt ? new Date(session.logoutAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ClockIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No recent sessions found</p>
          </div>
        )}
      </div>

      {/* Session Limit Modal */}
      <SessionLimitModal
        isOpen={showSessionLimitModal}
        onClose={() => setShowSessionLimitModal(false)}
        activeSessions={activeSessions}
        maxSessions={sessionInfo?.maxConcurrentSessions || 5}
        onRemoveSession={handleRemoveSession}
        onLogoutAll={handleLogoutAllDevices}
      />
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Actions</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <UserGroupIcon className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">Switch Account</h4>
                <p className="text-sm text-gray-500">Switch to a different account</p>
              </div>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700">
              Switch
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-600 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">Logout</h4>
                <p className="text-sm text-gray-500">Sign out of your account</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
      <div className="space-y-4">
        {Object.entries(notificationSettings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </h4>
              <p className="text-sm text-gray-500">
                Receive notifications for {key.toLowerCase().replace(/([A-Z])/g, ' $1')}
              </p>
            </div>
            <button
              onClick={() => handleNotificationToggle(key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );





  const renderSubscription = () => (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Current Subscription</h3>
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-semibold">{subscriptionData.currentPlan}</h4>
              <p className="text-green-100">{subscriptionData.planPrice}</p>
            </div>
            <div className="text-right">
              <SparklesIcon className="h-8 w-8 text-green-100" />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Plan Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subscriptionData.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Future Plans */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Future Plans (Coming Soon)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900">Starter</h4>
            <p className="text-3xl font-bold text-gray-900">$9<span className="text-sm font-normal text-gray-500">/month</span></p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>• 10 campaigns</li>
              <li>• 5 automations</li>
              <li>• Basic analytics</li>
              <li>• Email support</li>
            </ul>
            <button className="w-full mt-4 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" disabled>
              Coming Soon
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900">Pro</h4>
            <p className="text-3xl font-bold text-gray-900">$29<span className="text-sm font-normal text-gray-500">/month</span></p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>• 50 campaigns</li>
              <li>• 25 automations</li>
              <li>• Advanced analytics</li>
              <li>• Priority support</li>
            </ul>
            <button className="w-full mt-4 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" disabled>
              Coming Soon
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900">Enterprise</h4>
            <p className="text-3xl font-bold text-gray-900">$99<span className="text-sm font-normal text-gray-500">/month</span></p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>• Unlimited campaigns</li>
              <li>• Unlimited automations</li>
              <li>• Custom integrations</li>
              <li>• Dedicated support</li>
            </ul>
            <button className="w-full mt-4 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" disabled>
              Coming Soon
            </button>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
            <p className="text-sm text-blue-800">
              You're currently on our unlimited free plan! We're working on premium features for the future. 
              Stay tuned for updates on our paid plans.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTickets = () => (
    <div className="space-y-6">
      {/* Coming Soon */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <RocketLaunchIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Support Tickets</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Our comprehensive support ticket system is coming soon! You'll be able to create tickets, 
            track their status, and get help from our team.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Create Tickets</h4>
              <p className="text-sm text-gray-600">Submit support requests, bug reports, and feature requests</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Track Progress</h4>
              <p className="text-sm text-gray-600">Monitor ticket status and get updates in real-time</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Priority Support</h4>
              <p className="text-sm text-gray-600">Get faster responses for urgent issues</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Knowledge Base</h4>
              <p className="text-sm text-gray-600">Access helpful articles and tutorials</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-md mx-auto">
            <div className="flex items-center">
              <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
              <p className="text-sm text-blue-800">
                For now, please contact us directly at support@sociohiro.com for any issues or questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHelp = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <QuestionMarkCircleIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Help & Support</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Our comprehensive help and support system is coming soon! You'll have access to documentation, 
            tutorials, and direct support channels.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Documentation</h4>
              <p className="text-sm text-gray-600">Comprehensive guides and tutorials</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Video Tutorials</h4>
              <p className="text-sm text-gray-600">Step-by-step video guides</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Live Chat</h4>
              <p className="text-sm text-gray-600">Get instant help from our team</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Community Forum</h4>
              <p className="text-sm text-gray-600">Connect with other users</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-md mx-auto">
            <div className="flex items-center">
              <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
              <p className="text-sm text-blue-800">
                For now, please contact us at support@sociohiro.com for help and support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm">Manage your account preferences and platform settings</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mt-4"
          >
            <ArrowLeftIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckCircleIcon className="h-5 w-5 mr-2" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            )}
            {message.text}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 relative">
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            onClick={() => scrollTo('left')}
            className="absolute left-0 top-0 bottom-0 z-10 flex items-center justify-center w-10 sm:w-8 bg-white bg-opacity-90 hover:bg-opacity-100 border-r border-gray-200 transition-all duration-200"
            aria-label="Scroll left"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            onClick={() => scrollTo('right')}
            className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-center w-10 sm:w-8 bg-white bg-opacity-90 hover:bg-opacity-100 border-l border-gray-200 transition-all duration-200"
            aria-label="Scroll right"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Tab Navigation Container */}
        <div className={`relative ${canScrollLeft ? 'pl-10 sm:pl-8' : ''} ${canScrollRight ? 'pr-10 sm:pr-8' : ''}`}>
          <nav 
            ref={navRef}
            onScroll={handleScroll}
            className="-mb-px flex space-x-1 sm:space-x-1 md:space-x-2 lg:space-x-4 overflow-x-auto scrollbar-hide pb-1 scroll-smooth touch-pan-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3 sm:py-2 sm:px-2 md:px-3 lg:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 min-w-fit transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
              <tab.icon className="h-4 w-4 sm:h-5 sm:w-5 inline mr-1 flex-shrink-0" />
              <span className="hidden xl:inline">{tab.name}</span>
              <span className="hidden lg:inline xl:hidden">{tab.name.length > 10 ? tab.name.substring(0, 10) + '...' : tab.name}</span>
              <span className="hidden md:inline lg:hidden">{tab.name.length > 8 ? tab.name.substring(0, 8) + '...' : tab.name}</span>
              <span className="hidden sm:inline md:hidden">{tab.name.length > 6 ? tab.name.substring(0, 6) + '...' : tab.name}</span>
              <span className="sm:hidden">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Gradient fade indicators for scrollable content */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'session' && renderSessionInfo()}
        {activeTab === 'security' && renderSecurity()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'subscription' && renderSubscription()}
        {activeTab === 'tickets' && renderTickets()}
        {activeTab === 'help' && renderHelp()}
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        loading={logoutLoading}
      />
    </div>
  );
};

export default AccountSettings; 