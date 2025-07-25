import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getInstagramAccounts } from '../api';
import {
  ArrowLeftIcon,
  PlusIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  CogIcon,
  TrashIcon,
  ArrowPathIcon,
  GlobeAltIcon,
  CalendarIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

const InstagramAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await getInstagramAccounts();
      setAccounts(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setAccounts([]);
      setError('Failed to load Instagram accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectAccount = () => {
    // This would typically redirect to Instagram OAuth
    window.open('/api/instagram-oauth/login', '_blank');
  };

  const handleDisconnectAccount = (accountId) => {
    if (window.confirm('Are you sure you want to disconnect this account?')) {
      // Handle account disconnection
      console.log('Disconnecting account:', accountId);
    }
  };

  const handleRefreshAccount = (accountId) => {
    // Handle account refresh
    console.log('Refreshing account:', accountId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading accounts</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
        <button
          onClick={fetchAccounts}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  const connectedAccounts = Array.isArray(accounts) ? accounts.filter(acc => acc?.isConnected) : [];
  const disconnectedAccounts = Array.isArray(accounts) ? accounts.filter(acc => !acc?.isConnected) : [];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instagram Accounts</h1>
          <p className="text-gray-600 mt-2">Manage your connected Instagram accounts</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mt-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
        <button
          onClick={handleConnectAccount}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Connect Account
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Accounts</p>
              <p className="text-2xl font-semibold text-gray-900">{accounts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Connected</p>
              <p className="text-2xl font-semibold text-gray-900">{connectedAccounts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <XCircleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Disconnected</p>
              <p className="text-2xl font-semibold text-gray-900">{disconnectedAccounts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Connected Accounts</h2>
          <p className="text-sm text-gray-500">Accounts that are currently connected and active</p>
        </div>
        <div className="p-6">
          {connectedAccounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connectedAccounts.map((account) => (
                <div key={account?._id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserGroupIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">
                          {account?.username || 'Unknown Account'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {account?.accountType || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Connected
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Followers</span>
                      <span className="font-medium">{account?.followers?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Last Sync</span>
                      <span className="font-medium">
                        {account?.lastSync ? new Date(account.lastSync).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Status</span>
                      <span className="font-medium text-green-600">Active</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRefreshAccount(account._id)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <ArrowPathIcon className="h-4 w-4 mr-1" />
                      Refresh
                    </button>
                    <button
                      onClick={() => handleDisconnectAccount(account._id)}
                      className="inline-flex items-center justify-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No connected accounts</h3>
              <p className="mt-1 text-sm text-gray-500">Connect your first Instagram account to get started.</p>
              <div className="mt-6">
                <button
                  onClick={handleConnectAccount}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Connect Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Disconnected Accounts */}
      {disconnectedAccounts.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Disconnected Accounts</h2>
            <p className="text-sm text-gray-500">Accounts that need to be reconnected</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {disconnectedAccounts.map((account) => (
                <div key={account?._id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <UserGroupIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">
                          {account?.username || 'Unknown Account'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {account?.accountType || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Disconnected
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Followers</span>
                      <span className="font-medium">{account?.followers?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Last Sync</span>
                      <span className="font-medium">
                        {account?.lastSync ? new Date(account.lastSync).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Status</span>
                      <span className="font-medium text-yellow-600">Inactive</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleConnectAccount()}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Reconnect
                    </button>
                    <button
                      onClick={() => handleDisconnectAccount(account._id)}
                      className="inline-flex items-center justify-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstagramAccounts; 