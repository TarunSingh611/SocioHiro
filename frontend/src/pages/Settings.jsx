import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CogIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      orderUpdates: true,
      productAlerts: true
    },
    webhooks: {
      enabled: true,
      url: '',
      verifyToken: ''
    },
    automation: {
      enabled: true,
      maxExecutionsPerDay: 100
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Mock settings for now - in real app, fetch from API
      setSettings({
        notifications: {
          email: true,
          push: true,
          orderUpdates: true,
          productAlerts: true
        },
        webhooks: {
          enabled: true,
          url: 'https://your-domain.com/api/webhooks/instagram',
          verifyToken: 'your-verify-token'
        },
        automation: {
          enabled: true,
          maxExecutionsPerDay: 100
        }
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Mock save - in real app, save to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handleWebhookChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      webhooks: {
        ...prev.webhooks,
        [key]: value
      }
    }));
  };

  const handleAutomationChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      automation: {
        ...prev.automation,
        [key]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              <BellIcon className="h-6 w-6 text-blue-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => handleNotificationChange('email', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Push Notifications</label>
                  <p className="text-sm text-gray-500">Receive push notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={(e) => handleNotificationChange('push', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Order Updates</label>
                  <p className="text-sm text-gray-500">Get notified about order status changes</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.orderUpdates}
                  onChange={(e) => handleNotificationChange('orderUpdates', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Product Alerts</label>
                  <p className="text-sm text-gray-500">Get notified about low stock products</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.productAlerts}
                  onChange={(e) => handleNotificationChange('productAlerts', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Webhooks */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
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
                  checked={settings.webhooks.enabled}
                  onChange={(e) => handleWebhookChange('enabled', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Webhook URL
                </label>
                <input
                  type="url"
                  value={settings.webhooks.url}
                  onChange={(e) => handleWebhookChange('url', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="https://your-domain.com/api/webhooks/instagram"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Verify Token
                </label>
                <input
                  type="text"
                  value={settings.webhooks.verifyToken}
                  onChange={(e) => handleWebhookChange('verifyToken', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="your-verify-token"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Automation */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
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
                  checked={settings.automation.enabled}
                  onChange={(e) => handleAutomationChange('enabled', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Max Executions Per Day
                </label>
                <input
                  type="number"
                  value={settings.automation.maxExecutionsPerDay}
                  onChange={(e) => handleAutomationChange('maxExecutionsPerDay', parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  min="1"
                  max="1000"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Limit the number of automated responses per day
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              <ShieldCheckIcon className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Security</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  defaultValue="30"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  min="5"
                  max="1440"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Two-Factor Authentication</label>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Login Notifications</label>
                  <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              <KeyIcon className="h-6 w-6 text-yellow-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">API Configuration</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Instagram Client ID
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Your Instagram App Client ID"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Instagram Client Secret
                </label>
                <input
                  type="password"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Your Instagram App Client Secret"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Redirect URI
                </label>
                <input
                  type="url"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="https://your-domain.com/api/auth/instagram/callback"
                />
              </div>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Version</span>
                <span className="text-sm font-medium text-gray-900">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Last Updated</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 