import React, { useState, useEffect } from 'react';
import useContentStore from '../store/contentStore';
import ContentHeader from '../components/content/ContentHeader';
import ContentStats from '../components/content/ContentStats';
import ContentList from '../components/content/ContentList';
import ContentForm from '../components/content/ContentForm';
import LoadingSpinner from '../components/content/LoadingSpinner';

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
    fetchContent,
    useRealData,
    setUseRealData
  } = useContentStore();

  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Debug logging
  useEffect(() => {
    console.log('Content state:', {
      content,
      loading,
      error,
      useRealData,
      contentType: typeof content,
      isArray: Array.isArray(content),
      length: content?.length
    });
  }, [content, loading, error, useRealData]);

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

  const toggleDataMode = () => {
    setUseRealData(!useRealData);
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
          <button
            onClick={toggleDataMode}
            className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Switch to {useRealData ? 'Mock' : 'Real'} Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ContentHeader onCreateNew={handleCreateNew} />
      
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-800 text-sm">
            Debug: Content type: {typeof content}, Length: {content?.length || 0}, 
            Use Real Data: {useRealData ? 'Yes' : 'No'}
          </p>
          <button
            onClick={toggleDataMode}
            className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Switch to {useRealData ? 'Mock' : 'Real'} Data
          </button>
        </div>
      )}
      
      <ContentStats stats={stats} />
      
      <ContentList
        content={content || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPublish={handlePublish}
        onCreateNew={handleCreateNew}
      />

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