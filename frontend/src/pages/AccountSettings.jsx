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
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const AccountSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const navRef = React.useRef(null);

  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'My Business',
    website: 'https://mybusiness.com',
    bio: 'Social media manager and content creator'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    campaignUpdates: true,
    automationAlerts: true,
    weeklyReports: false,
    securityAlerts: true
  });

  // Platform-specific settings from old Settings page
  const [platformSettings, setPlatformSettings] = useState({
    webhooks: {
      enabled: true,
      url: 'https://your-domain.com/api/webhooks/instagram',
      verifyToken: 'your-verify-token'
    },
    automation: {
      enabled: true,
      maxExecutionsPerDay: 100
    },
    apiKeys: {
      instagramClientId: '',
      instagramClientSecret: '',
      redirectUri: 'https://your-domain.com/api/auth/instagram/callback'
    }
  });

  const [subscriptionData, setSubscriptionData] = useState({
    currentPlan: 'Pro',
    planPrice: '$29/month',
    nextBillingDate: '2024-02-15',
    usage: {
      campaigns: 12,
      automations: 8,
      accounts: 3,
      storage: '2.5GB'
    },
    limits: {
      campaigns: 50,
      automations: 25,
      accounts: 10,
      storage: '10GB'
    }
  });

  const [connectedAccounts, setConnectedAccounts] = useState([
    {
      id: 1,
      platform: 'Instagram',
      username: '@mybusiness',
      status: 'connected',
      lastSync: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      platform: 'Facebook',
      username: 'My Business Page',
      status: 'connected',
      lastSync: '2024-01-14T15:45:00Z'
    },
    {
      id: 3,
      platform: 'Twitter',
      username: '@mybusiness',
      status: 'disconnected',
      lastSync: null
    }
  ]);

  const [newTicket, setNewTicket] = useState({
    title: '',
    type: 'support',
    priority: 'medium',
    description: ''
  });

  const [tickets, setTickets] = useState([
    {
      id: 1,
      title: 'Instagram API Connection Issue',
      type: 'bug',
      priority: 'high',
      status: 'open',
      description: 'Having trouble connecting my Instagram account to the platform. Getting authentication errors.',
      createdAt: '2024-01-10T09:00:00Z',
      lastUpdated: '2024-01-12T14:30:00Z'
    },
    {
      id: 2,
      title: 'Feature Request: Bulk Campaign Creation',
      type: 'feature',
      priority: 'medium',
      status: 'in_progress',
      description: 'Would like to be able to create multiple campaigns at once instead of one by one.',
      createdAt: '2024-01-08T11:00:00Z',
      lastUpdated: '2024-01-11T16:45:00Z'
    },
    {
      id: 3,
      title: 'Automation Not Working',
      type: 'support',
      priority: 'urgent',
      status: 'closed',
      description: 'My automation rules are not triggering as expected. Need immediate assistance.',
      createdAt: '2024-01-05T13:00:00Z',
      lastUpdated: '2024-01-09T10:15:00Z'
    }
  ]);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'platform', name: 'Platform Settings', icon: CogIcon },
    { id: 'accounts', name: 'Connected Accounts', icon: UserGroupIcon },
    { id: 'subscription', name: 'Subscription', icon: CreditCardIcon },
    { id: 'tickets', name: 'Tickets', icon: QuestionMarkCircleIcon },
    { id: 'help', name: 'Help & Support', icon: InformationCircleIcon }
  ];

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformSettingsSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Platform settings saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save platform settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationToggle = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePlatformSettingChange = (section, key, value) => {
    setPlatformSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      navigate('/login');
    }
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

  const handleDisconnectAccount = (accountId) => {
    if (window.confirm('Are you sure you want to disconnect this account?')) {
      setConnectedAccounts(prev => prev.filter(acc => acc.id !== accountId));
    }
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <input
              type="text"
              value={profileData.company}
              onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <input
              type="url"
              value={profileData.website}
              onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1 p-3"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>

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

  const renderPlatformSettings = () => (
    <div className="space-y-6">
      {/* Webhooks */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <GlobeAltIcon className="h-6 w-6 text-green-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Webhooks</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Enable Webhooks</label>
              <p className="text-sm text-gray-500">Receive real-time updates from Instagram</p>
            </div>
            <input
              type="checkbox"
              checked={platformSettings.webhooks.enabled}
              onChange={(e) => handlePlatformSettingChange('webhooks', 'enabled', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Webhook URL</label>
            <input
              type="url"
              value={platformSettings.webhooks.url}
              onChange={(e) => handlePlatformSettingChange('webhooks', 'url', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="https://your-domain.com/api/webhooks/instagram"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Verify Token</label>
            <input
              type="text"
              value={platformSettings.webhooks.verifyToken}
              onChange={(e) => handlePlatformSettingChange('webhooks', 'verifyToken', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="your-verify-token"
            />
          </div>
        </div>
      </div>

      {/* Automation */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <CogIcon className="h-6 w-6 text-purple-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Automation</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Enable Automation</label>
              <p className="text-sm text-gray-500">Allow automated responses to Instagram interactions</p>
            </div>
            <input
              type="checkbox"
              checked={platformSettings.automation.enabled}
              onChange={(e) => handlePlatformSettingChange('automation', 'enabled', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Executions Per Day</label>
            <input
              type="number"
              value={platformSettings.automation.maxExecutionsPerDay}
              onChange={(e) => handlePlatformSettingChange('automation', 'maxExecutionsPerDay', parseInt(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              min="1"
              max="1000"
            />
            <p className="text-sm text-gray-500 mt-1">Limit the number of automated responses per day</p>
          </div>
        </div>
      </div>

      {/* API Configuration */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <KeyIcon className="h-6 w-6 text-yellow-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">API Configuration</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Instagram Client ID</label>
            <input
              type="text"
              value={platformSettings.apiKeys.instagramClientId}
              onChange={(e) => handlePlatformSettingChange('apiKeys', 'instagramClientId', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Your Instagram App Client ID"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Instagram Client Secret</label>
            <input
              type="password"
              value={platformSettings.apiKeys.instagramClientSecret}
              onChange={(e) => handlePlatformSettingChange('apiKeys', 'instagramClientSecret', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Your Instagram App Client Secret"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Redirect URI</label>
            <input
              type="url"
              value={platformSettings.apiKeys.redirectUri}
              onChange={(e) => handlePlatformSettingChange('apiKeys', 'redirectUri', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="https://your-domain.com/api/auth/instagram/callback"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handlePlatformSettingsSave}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Platform Settings'}
        </button>
      </div>
    </div>
  );

  const renderConnectedAccounts = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Connected Social Media Accounts</h3>
      <div className="space-y-4">
        {connectedAccounts.map((account) => (
          <div key={account.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${
                account.status === 'connected' ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <UserGroupIcon className={`h-5 w-5 ${
                  account.status === 'connected' ? 'text-green-600' : 'text-gray-400'
                }`} />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">{account.platform}</h4>
                <p className="text-sm text-gray-500">{account.username}</p>
                {account.lastSync && (
                  <p className="text-xs text-gray-400">
                    Last sync: {new Date(account.lastSync).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                account.status === 'connected' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {account.status}
              </span>
              {account.status === 'connected' && (
                <button
                  onClick={() => handleDisconnectAccount(account.id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Disconnect
                </button>
              )}
            </div>
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
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-semibold">{subscriptionData.currentPlan} Plan</h4>
              <p className="text-blue-100">{subscriptionData.planPrice}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Next billing</p>
              <p className="font-medium">{new Date(subscriptionData.nextBillingDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Usage & Limits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Campaigns</span>
                <span className="text-gray-900">{subscriptionData.usage.campaigns} / {subscriptionData.limits.campaigns}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(subscriptionData.usage.campaigns / subscriptionData.limits.campaigns) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Automations</span>
                <span className="text-gray-900">{subscriptionData.usage.automations} / {subscriptionData.limits.automations}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(subscriptionData.usage.automations / subscriptionData.limits.automations) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Connected Accounts</span>
                <span className="text-gray-900">{subscriptionData.usage.accounts} / {subscriptionData.limits.accounts}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${(subscriptionData.usage.accounts / subscriptionData.limits.accounts) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Storage</span>
                <span className="text-gray-900">{subscriptionData.usage.storage} / {subscriptionData.limits.storage}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full" 
                  style={{ width: '25%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Options */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900">Starter</h4>
            <p className="text-3xl font-bold text-gray-900">$9<span className="text-sm font-normal text-gray-500">/month</span></p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>• 10 campaigns</li>
              <li>• 5 automations</li>
              <li>• 2 connected accounts</li>
              <li>• 1GB storage</li>
            </ul>
            <button className="w-full mt-4 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Current Plan
            </button>
          </div>
          <div className="border-2 border-blue-500 rounded-lg p-6 bg-blue-50">
            <h4 className="text-lg font-semibold text-gray-900">Pro</h4>
            <p className="text-3xl font-bold text-gray-900">$29<span className="text-sm font-normal text-gray-500">/month</span></p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>• 50 campaigns</li>
              <li>• 25 automations</li>
              <li>• 10 connected accounts</li>
              <li>• 10GB storage</li>
            </ul>
            <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-sm font-medium rounded-md text-white hover:bg-blue-700">
              Current Plan
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900">Enterprise</h4>
            <p className="text-3xl font-bold text-gray-900">$99<span className="text-sm font-normal text-gray-500">/month</span></p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>• Unlimited campaigns</li>
              <li>• Unlimited automations</li>
              <li>• Unlimited accounts</li>
              <li>• 100GB storage</li>
            </ul>
            <button className="w-full mt-4 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTickets = () => (
    <div className="space-y-6">
      {/* Create New Ticket */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Create New Ticket</h3>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={newTicket.title}
                onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of your issue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={newTicket.type}
                onChange={(e) => setNewTicket(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="support">Support</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="complaint">Complaint</option>
                <option value="suggestion">Suggestion</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={newTicket.priority}
              onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={newTicket.description}
              onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Please provide detailed information about your issue, suggestion, or complaint..."
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>

      {/* Existing Tickets */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Tickets</h3>
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">{ticket.title}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    ticket.status === 'open' ? 'bg-red-100 text-red-800' :
                    ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {ticket.priority}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(ticket.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHelp = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Help & Support</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <QuestionMarkCircleIcon className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Documentation</h4>
              <p className="text-sm text-gray-500">Read our guides and tutorials</p>
            </div>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700">
            View
          </button>
        </div>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <InformationCircleIcon className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Contact Support</h4>
              <p className="text-sm text-gray-500">Get help from our team</p>
            </div>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700">
            Contact
          </button>
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
        {activeTab === 'security' && renderSecurity()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'platform' && renderPlatformSettings()}
        {activeTab === 'accounts' && renderConnectedAccounts()}
        {activeTab === 'subscription' && renderSubscription()}
        {activeTab === 'tickets' && renderTickets()}
        {activeTab === 'help' && renderHelp()}
      </div>
    </div>
  );
};

export default AccountSettings; 