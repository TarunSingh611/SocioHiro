import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import AutomationCard from './AutomationCard';

const AutomationList = ({ 
  automations, 
  selectedAutomations, 
  onSelectAutomation, 
  onToggleStatus, 
  onTest, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="divide-y divide-gray-200">
        {automations.length > 0 ? (
          automations.map((automation) => (
            <AutomationCard
              key={automation._id}
              automation={automation}
              isSelected={selectedAutomations.includes(automation._id)}
              onSelect={(e) => onSelectAutomation(automation._id, e.target.checked)}
              onToggleStatus={onToggleStatus}
              onTest={onTest}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="p-8 text-center">
            <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No automations</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first automation.
            </p>
            <div className="mt-6">
              <Link
                to="/automation/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                New Automation
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutomationList; 