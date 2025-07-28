import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAutomation } from '../hooks/useAutomation';
import AutomationStats from '../components/automation/AutomationStats';
import AutomationFilters from '../components/automation/AutomationFilters';
import AutomationList from '../components/automation/AutomationList';
import AutomationLogs from '../components/automation/AutomationLogs';
import AutomationModal from '../components/automation/AutomationModal';

const Automation = () => {
  const {
    automations,
    stats,
    logs,
    loading,
    error,
    handleDelete,
    handleToggleStatus,
    handleTestAutomation,
    handleBulkDelete,
    updateAutomation,
    addAutomation
  } = useAutomation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState(null);
  const [selectedAutomations, setSelectedAutomations] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    isActive: '',
    triggerType: '',
    search: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    triggerType: 'comment',
    actionType: 'send_dm',
    keywords: '',
    responseMessage: '',
    exactMatch: false,
    caseSensitive: false,
    isActive: true,
    conditions: {
      maxExecutionsPerDay: 10,
      cooldownMinutes: 5,
      maxExecutionsPerUser: 1
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAutomation) {
        // Update existing automation
        const updatedAutomation = { ...editingAutomation, ...formData };
        updateAutomation(editingAutomation._id, updatedAutomation);
      } else {
        // Create new automation
        const newAutomation = {
          _id: `automation_${Date.now()}`,
          ...formData,
          executionCount: 0,
          lastExecuted: null,
          createdAt: new Date().toISOString()
        };
        addAutomation(newAutomation);
      }
      setShowAddModal(false);
      setEditingAutomation(null);
      resetForm();
    } catch (error) {
      console.error('Error saving automation:', error);
    }
  };

  const handleEdit = (automation) => {
    setEditingAutomation(automation);
    setFormData({
      name: automation.name || '',
      description: automation.description || '',
      triggerType: automation.triggerType || 'comment',
      actionType: automation.actionType || 'send_dm',
      keywords: automation.keywords ? automation.keywords.join(', ') : '',
      responseMessage: automation.responseMessage || '',
      exactMatch: automation.exactMatch || false,
      caseSensitive: automation.caseSensitive || false,
      isActive: automation.isActive !== false,
      conditions: automation.conditions || {
        maxExecutionsPerDay: 10,
        cooldownMinutes: 5,
        maxExecutionsPerUser: 1
      }
    });
    setShowAddModal(true);
  };

  const handleDeleteAutomation = async (automationId) => {
    if (window.confirm('Are you sure you want to delete this automation?')) {
      try {
        await handleDelete(automationId);
      } catch (error) {
        console.error('Error deleting automation:', error);
      }
    }
  };

  const handleToggleStatusAutomation = async (automationId, currentStatus) => {
    try {
      await handleToggleStatus(automationId, currentStatus);
    } catch (error) {
      console.error('Error toggling automation status:', error);
    }
  };

  const handleTestAutomationAction = async (automationId) => {
    try {
      const result = await handleTestAutomation(automationId);
      alert(`Test completed! Matched: ${result.matched}, Can Execute: ${result.canExecute}`);
    } catch (error) {
      console.error('Error testing automation:', error);
    }
  };

  const handleBulkDeleteAction = async () => {
    if (selectedAutomations.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedAutomations.length} automations?`)) {
      try {
        await handleBulkDelete(selectedAutomations);
        setSelectedAutomations([]);
      } catch (error) {
        console.error('Error bulk deleting automations:', error);
      }
    }
  };

  const handleSelectAutomation = (automationId, isSelected) => {
    if (isSelected) {
      setSelectedAutomations([...selectedAutomations, automationId]);
    } else {
      setSelectedAutomations(selectedAutomations.filter(id => id !== automationId));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      triggerType: 'comment',
      actionType: 'send_dm',
      keywords: '',
      responseMessage: '',
      exactMatch: false,
      caseSensitive: false,
      isActive: true,
      conditions: {
        maxExecutionsPerDay: 10,
        cooldownMinutes: 5,
        maxExecutionsPerUser: 1
      }
    });
  };

  const filteredAutomations = automations.filter(automation => {
    if (filters.isActive !== '' && automation.isActive !== (filters.isActive === 'true')) {
      return false;
    }
    if (filters.triggerType && automation.triggerType !== filters.triggerType) {
      return false;
    }
    if (filters.search && !automation.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading automations: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Automation</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm">Manage your automated responses and actions</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Link
            to="/automation/new"
            className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-3 w-4 sm:h-4 sm:w-4 mr-2" />
            New Automation
          </Link>
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
      <AutomationStats stats={stats} />

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'logs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Execution Logs
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <>
              {/* Filters */}
              <AutomationFilters filters={filters} setFilters={setFilters} />

              {/* Bulk Actions */}
              {selectedAutomations.length > 0 && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">
                      {selectedAutomations.length} automation(s) selected
                    </span>
                    <button
                      onClick={handleBulkDeleteAction}
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete Selected
                    </button>
                  </div>
                </div>
              )}

              {/* Automations List */}
              <AutomationList
                automations={filteredAutomations}
                selectedAutomations={selectedAutomations}
                onSelectAutomation={handleSelectAutomation}
                onToggleStatus={handleToggleStatusAutomation}
                onTest={handleTestAutomationAction}
                onEdit={handleEdit}
                onDelete={handleDeleteAutomation}
              />
            </>
          )}

          {activeTab === 'logs' && (
            <AutomationLogs logs={logs} showLogs={showLogs} setShowLogs={setShowLogs} />
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AutomationModal
        showModal={showAddModal}
        editingAutomation={editingAutomation}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onClose={() => {
          setShowAddModal(false);
          setEditingAutomation(null);
          resetForm();
        }}
        resetForm={resetForm}
      />
    </div>
  );
};

export default Automation; 