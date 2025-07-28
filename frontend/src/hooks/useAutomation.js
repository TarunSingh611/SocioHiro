import { useState, useEffect } from 'react';
import {
  getAutomations,
  getAutomationStats,
  getAutomationLogs,
  deleteAutomation,
  toggleAutomationStatus,
  testAutomation,
  bulkDeleteAutomations
} from '../api';

export const useAutomation = () => {
  const [automations, setAutomations] = useState([]);
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [automationsRes, statsRes, logsRes] = await Promise.all([
        getAutomations(),
        getAutomationStats(),
        getAutomationLogs({ limit: 10 })
      ]);
      
      setAutomations(automationsRes.data);
      setStats(statsRes.data);
      setLogs(logsRes.data);
    } catch (err) {
      console.error('Error fetching automation data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (automationId) => {
    try {
      await deleteAutomation(automationId);
      setAutomations(prev => prev.filter(acc => acc._id !== automationId));
    } catch (err) {
      console.error('Error deleting automation:', err);
      throw err;
    }
  };

  const handleToggleStatus = async (automationId, currentStatus) => {
    try {
      await toggleAutomationStatus(automationId);
      setAutomations(prev => prev.map(acc => 
        acc._id === automationId 
          ? { ...acc, isActive: !currentStatus }
          : acc
      ));
    } catch (err) {
      console.error('Error toggling automation status:', err);
      throw err;
    }
  };

  const handleTestAutomation = async (automationId) => {
    try {
      const testData = { text: 'test comment', mediaId: 'test_media' };
      const result = await testAutomation(automationId, testData);
      return result.data;
    } catch (err) {
      console.error('Error testing automation:', err);
      throw err;
    }
  };

  const handleBulkDelete = async (automationIds) => {
    try {
      await bulkDeleteAutomations(automationIds);
      setAutomations(prev => prev.filter(acc => !automationIds.includes(acc._id)));
    } catch (err) {
      console.error('Error bulk deleting automations:', err);
      throw err;
    }
  };

  const updateAutomation = (automationId, updates) => {
    setAutomations(prev => prev.map(acc => 
      acc._id === automationId 
        ? { ...acc, ...updates }
        : acc
    ));
  };

  const addAutomation = (automation) => {
    setAutomations(prev => [automation, ...prev]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    // State
    automations,
    stats,
    logs,
    loading,
    error,
    
    // Actions
    fetchData,
    handleDelete,
    handleToggleStatus,
    handleTestAutomation,
    handleBulkDelete,
    updateAutomation,
    addAutomation
  };
}; 