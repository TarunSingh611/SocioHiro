import React from 'react';

const AutomationFilters = ({ filters, setFilters }) => {
  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={filters.isActive}
          onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">All</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Trigger Type</label>
        <select
          value={filters.triggerType}
          onChange={(e) => setFilters({ ...filters, triggerType: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="">All</option>
          <option value="comment">Comment</option>
          <option value="dm">Direct Message</option>
          <option value="mention">Mention</option>
          <option value="like">Like</option>
          <option value="follow">Follow</option>
          <option value="hashtag">Hashtag</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Search automations..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
};

export default AutomationFilters; 