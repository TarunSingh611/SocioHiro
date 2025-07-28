import React, { useState, useEffect } from 'react';
import useContentStore from '../store/contentStore';
import ContentHeader from '../components/content/ContentHeader';
import ContentStats from '../components/content/ContentStats';
import ContentList from '../components/content/ContentList';
import ContentAnalytics from '../components/content/ContentAnalytics';
import ContentForm from '../components/content/ContentForm';
import LoadingSpinner from '../components/content/LoadingSpinner';
import {
  PhotoIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Content = () => {
  const {
    content,
    stats,
    loading,
    error,
    createContent,
    updateContent,
    deleteContent,
    publishContent,
    fetchContent
  } = useContentStore();

  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('content'); // 'content' or 'analytics'

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleCreateNew = () => {
    setEditingContent(null);
    setShowForm(true);
  };

  const handleEdit = (contentItem) => {
    setEditingContent(contentItem);
    setShowForm(true);
  };

  const handleDelete = async (contentId) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await deleteContent(contentId);
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  const handlePublish = async (contentId) => {
    try {
      await publishContent(contentId);
    } catch (error) {
      console.error('Error publishing content:', error);
    }
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingContent) {
        const contentId = editingContent._id || editingContent.id;
        await updateContent(contentId, formData);
      } else {
        await createContent(formData);
      }
      setShowForm(false);
      setEditingContent(null);
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingContent(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <ContentHeader onCreateNew={handleCreateNew} />
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Error loading content: {error}</p>
          <p className="text-red-600 text-sm mt-2">
            Please check your connection and try again. Only real Instagram data is displayed.
          </p>
        </div>
      </div>
    );
  }

  // Ensure content is an array with null checking
  const contentArray = Array.isArray(content) ? content : [];

  return (
    <div className="space-y-6">
      <ContentHeader onCreateNew={handleCreateNew} />
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('content')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <PhotoIcon className="h-5 w-5 inline mr-2" />
              Content
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ChartBarIcon className="h-5 w-5 inline mr-2" />
              Analytics
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'content' ? (
            <div className="space-y-6">
              <ContentStats stats={stats} content={contentArray} />
              <ContentList
                content={contentArray}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPublish={handlePublish}
                onCreateNew={handleCreateNew}
              />
            </div>
          ) : (
            <ContentAnalytics content={contentArray} />
          )}
        </div>
      </div>

      {showForm && (
        <ContentForm
          content={editingContent}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default Content; 