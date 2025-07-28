import React, { useState, useEffect } from 'react';
import {
  ExclamationTriangleIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  XMarkIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const SessionLimitModal = ({ 
  isOpen, 
  onClose, 
  activeSessions, 
  maxSessions, 
  onRemoveSession,
  onLogoutAll 
}) => {
  const [selectedSession, setSelectedSession] = useState(null);

  const getDeviceIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'ios':
      case 'android':
        return <DevicePhoneMobileIcon className="h-5 w-5" />;
      case 'ipad':
        return <DeviceTabletIcon className="h-5 w-5" />;
      default:
        return <ComputerDesktopIcon className="h-5 w-5" />;
    }
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Session Limit Reached
              </h3>
              <p className="text-sm text-gray-600">
                You have {activeSessions.length} active sessions (max: {maxSessions})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-900 mb-1">
                    Session Limit Information
                  </h4>
                  <p className="text-sm text-blue-700">
                    You've reached your maximum allowed sessions. To continue, you'll need to 
                    log out from another device or remove an existing session.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">
              Active Sessions ({activeSessions?.length || 0})
            </h4>
            
            {activeSessions?.filter(session => session && session.sessionId).map((session) => (
              <div
                key={session.sessionId}
                className={`border rounded-lg p-4 transition-all ${
                  selectedSession?.sessionId === session.sessionId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
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
                        {session.isCurrentSession && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        IP: {session.deviceInfo?.ipAddress || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Last activity: {session.lastActivityAt ? new Date(session.lastActivityAt).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {!session.isCurrentSession && (
                    <button
                      onClick={() => setSelectedSession(session)}
                      className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center space-x-1"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-3">
            <button
              onClick={onLogoutAll}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Logout All Devices
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
          
          {selectedSession && (
            <button
              onClick={() => {
                onRemoveSession(selectedSession.sessionId);
                setSelectedSession(null);
              }}
              className="px-4 py-2 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              Remove Selected Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionLimitModal; 