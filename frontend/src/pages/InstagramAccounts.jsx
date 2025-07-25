import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  CogIcon,
  ChartBarIcon,
  PhotoIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

const InstagramAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      // Mock data for now
      const mockAccounts = [
        {
          id: 1,
          username: '@mybusiness',
          displayName: 'My Business',
          type: 'business',
          status: 'connected',
          followers: 12500,
          following: 500,
          posts: 150,
          lastSync: '2024-01-15T10:30:00Z',
          profileImage: null
        },
        {
          id: 2,
          username: '@personal',
          displayName: 'Personal Account',
          type: 'personal',
          status: 'connected',
          followers: 850,
          following: 200,
          posts: 45,
          lastSync: '2024-01-14T15:45:00Z',
          profileImage: null
        },
        {
          id: 3,
          username: '@brand',
          displayName: 'Brand Account',
          type: 'business',
          status: 'disconnected',
          followers: 0,
          following: 0,
          posts: 0,
          lastSync: null,
          profileImage: null
        }
      ];
      setAccounts(mockAccounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (accountId) => {
    try {
      // Mock connection logic
      setAccounts(prev => prev.map(acc => 
        acc.id === accountId 
          ? { ...acc, status: 'connected', lastSync: new Date().toISOString() }
          : acc
      ));
    } catch (error) {
      console.error('Error connecting account:', error);
    }
  };

  const handleDisconnect = async (accountId) => {
    if (window.confirm('Are you sure you want to disconnect this account?')) {
      try {
        setAccounts(prev => prev.map(acc => 
          acc.id === accountId 
            ? { ...acc, status: 'disconnected', lastSync: null }
            : acc
        ));
      } catch (error) {
        console.error('Error disconnecting account:', error);
      }
    }
  };

  const handleRefresh = async (accountId) => {
    try {
      // Mock refresh logic
      setAccounts(prev => prev.map(acc => 
        acc.id === accountId 
          ? { ...acc, lastSync: new Date().toISOString() }
          : acc
      ));
    } catch (error) {
      console.error('Error refreshing account:', error);
    }
  };

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Instagram Accounts</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm">Manage your connected Instagram accounts</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => setShowConnectModal(true)}
            className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-2" />
            Connect Account
          </button>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
              <UserGroupIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Accounts</p>
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">{accounts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Connected</p>
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                {accounts.filter(acc => acc.status === 'connected').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
              <XCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Disconnected</p>
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                {accounts.filter(acc => acc.status === 'disconnected').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
              <ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Followers</p>
              <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                {accounts.reduce((sum, acc) => sum + (acc.followers || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Connected Accounts</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <div key={account.id} className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        {account.profileImage ? (
                          <img 
                            src={account.profileImage} 
                            alt={account.displayName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <UserGroupIcon className="h-6 w-8 sm:h-8 sm:w-8 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                          {account.displayName}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          account.type === 'business' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {account.type}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
                        {account.username}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">
                          {account.followers?.toLocaleString()} followers
                        </span>
                        <span className="text-xs text-gray-500">
                          {account.posts} posts
                        </span>
                        {account.lastSync && (
                          <span className="text-xs text-gray-500">
                            Last sync: {new Date(account.lastSync).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      account.status === 'connected' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {account.status}
                    </span>
                    {account.status === 'connected' ? (
                      <>
                        <button
                          onClick={() => handleRefresh(account.id)}
                          className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                        >
                          <ArrowPathIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-1" />
                          Refresh
                        </button>
                        <Link
                          to={`/instagram-accounts/${account.id}/analytics`}
                          className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          <ChartBarIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-1" />
                          Analytics
                        </Link>
                        <button
                          onClick={() => handleDisconnect(account.id)}
                          className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50"
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleConnect(account.id)}
                        className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                      >
                        <CheckCircleIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-1" />
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <UserGroupIcon className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No accounts</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">Connect your first Instagram account to get started.</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowConnectModal(true)}
                  className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent shadow-sm text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-2" />
                  Connect Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Connect Account Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 sm:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Connect Instagram Account</h3>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Account Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="personal">Personal Account</option>
                    <option value="business">Business Account</option>
                    <option value="creator">Creator Account</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Instagram Username
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="@username"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your display name"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CogIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Connection Required</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>You'll need to authorize this app to access your Instagram account. This will redirect you to Instagram's authorization page.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowConnectModal(false)}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    Connect Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstagramAccounts; 