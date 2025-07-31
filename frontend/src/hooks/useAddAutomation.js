import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAutomation } from '../api';
import contentService from '../services/contentService';

export const useAddAutomation = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    cooldownMinutes: 0, // Minimum cooldown for maximum responsiveness
    maxExecutionsPerUser: 10, // Maximum executions per user
    conditions: {
      maxExecutionsPerDay: 100000, // Maximum executions per day for large accounts
      timeOfDay: {
        start: '',
        end: ''
      },
      daysOfWeek: [],
      userFollowerCount: {
        min: null,
        max: null
      },
      userAccountAge: {
        min: null,
        max: null
      },
      requireVerifiedUser: false
    }
  });

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contentService.fetchContent();
      const content = response.content;
      // The API returns the content array directly
      const contentArray = Array.isArray(content) ? content : [];
      
      setContent(contentArray);
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(err.message || 'Failed to load content');
      setContent([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.name.trim() !== '' && formData.name.length >= 3;
      case 2:
        return formData.triggerType && formData.actionType;
      case 3:
        return true; // Content selection is optional
      case 4:
        // Check if message is required for the action type
        const messageRequired = ['send_dm', 'reply_comment', 'send_story_reply'].includes(formData.actionType);
        if (messageRequired) {
          return formData.responseMessage.trim() !== '' && formData.responseMessage.length >= 5;
        }
        return true; // No message required for like_comment and follow_user
      default:
        return false;
    }
  };

  const getStepValidationMessage = (step) => {
    switch (step) {
      case 1:
        if (!formData.name.trim()) return 'Please enter an automation name';
        if (formData.name.length < 3) return 'Automation name must be at least 3 characters';
        return null;
      case 2:
        if (!formData.triggerType) return 'Please select a trigger type';
        if (!formData.actionType) return 'Please select an action type';
        return null;
      case 4:
        const messageRequired = ['send_dm', 'reply_comment', 'send_story_reply'].includes(formData.actionType);
        if (messageRequired) {
          if (!formData.responseMessage.trim()) return 'Please enter a response message';
          if (formData.responseMessage.length < 5) return 'Response message must be at least 5 characters';
        }
        return null;
      default:
        return null;
    }
  };

  const nextStep = () => {
    const validationMessage = getStepValidationMessage(currentStep);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    if (currentStep < 4 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationMessage = getStepValidationMessage(currentStep);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    if (!isStepValid(currentStep)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare automation data with proper structure
      const automationData = {
        ...formData,
        // Handle keywords properly - convert string to array and add to triggers
        keywords: formData.keywords ? formData.keywords.split(',').map(k => k.trim()).filter(k => k) : [],
        // Handle content selection properly
        contentId: selectedContent?._id || null,
        instagramId: selectedContent?.instagramId || null,
        applyToAllContent: !selectedContent, // Set to true if no specific content selected
        // Ensure conditions object is properly structured
        conditions: {
          ...formData.conditions,
          maxExecutionsPerDay: formData.conditions.maxExecutionsPerDay || 100000,
          timeOfDay: formData.conditions.timeOfDay || { start: '', end: '' },
          daysOfWeek: formData.conditions.daysOfWeek || [],
          userFollowerCount: formData.conditions.userFollowerCount || { min: null, max: null },
          userAccountAge: formData.conditions.userAccountAge || { min: null, max: null },
          requireVerifiedUser: formData.conditions.requireVerifiedUser || false
        },
        cooldownMinutes: formData.cooldownMinutes || 0,
        maxExecutionsPerUser: formData.maxExecutionsPerUser || 10
      };

      // Remove empty or null values from conditions
      Object.keys(automationData.conditions).forEach(key => {
        if (automationData.conditions[key] === null || automationData.conditions[key] === '') {
          delete automationData.conditions[key];
        }
      });

      await createAutomation(automationData);
      navigate('/automation');
    } catch (err) {
      console.error('Error creating automation:', err);
      setError(err.message || 'Failed to create automation');
    } finally {
      setLoading(false);
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
      cooldownMinutes: 0, // Minimum cooldown for maximum responsiveness
      maxExecutionsPerUser: 10, // Maximum executions per user
      conditions: {
        maxExecutionsPerDay: 100000, // Maximum executions per day for large accounts
        timeOfDay: {
          start: '',
          end: ''
        },
        daysOfWeek: [],
        userFollowerCount: {
          min: null,
          max: null
        },
        userAccountAge: {
          min: null,
          max: null
        },
        requireVerifiedUser: false
      }
    });
    setSelectedContent(null);
    setCurrentStep(1);
    setError(null);
  };

  // Auto-advance to next step when all required fields are filled
  useEffect(() => {
    if (currentStep < 4 && isStepValid(currentStep)) {
      // Don't auto-advance, let user control the flow
    }
  }, [formData, currentStep]);

  useEffect(() => {
    fetchContent();
  }, []);

  return {
    // State
    content,
    selectedContent,
    currentStep,
    loading,
    error,
    formData,
    
    // Actions
    setSelectedContent,
    setCurrentStep,
    setFormData,
    nextStep,
    prevStep,
    handleSubmit,
    resetForm,
    isStepValid,
    getStepValidationMessage,
    fetchContent
  };
}; 