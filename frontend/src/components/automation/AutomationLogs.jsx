import React from 'react';
import { ChevronDownIcon, ChevronUpIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const AutomationLogs = ({ logs, showLogs, setShowLogs }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Execution Logs</h3>
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          {showLogs ? (
            <>
              <ChevronUpIcon className="h-4 w-4 mr-2" />
              Hide Logs
            </>
          ) : (
            <>
              <ChevronDownIcon className="h-4 w-4 mr-2" />
              Show Logs
            </>
          )}
        </button>
      </div>
      
      {showLogs && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log._id} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {log.success ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {log.ruleId?.name || 'Unknown Rule'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {log.triggerType} • {log.senderId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(log.executedAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600">
                      {log.triggerText}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomationLogs; 