import React, { useState, useEffect } from 'react';
import useContentStore from '../store/contentStore';
import ContentHeader from '../components/content/ContentHeader';
import ContentStats from '../components/content/ContentStats';
import ContentList from '../components/content/ContentList';
import ContentForm from '../components/content/ContentForm';
import AnimatedLoadingBar from '../components/content/AnimatedLoadingBar';


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
    return (
      <div className="space-y-6">
        <ContentHeader onCreateNew={handleCreateNew} />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Your Content</h3>
            <p className="text-gray-600 mb-6">
              Fetching your Instagram posts and content data...
            </p>
            
            {/* Animated Loading Bar */}
            <AnimatedLoadingBar 
              duration={4000}
              showProgress={true}
              className="max-w-md mx-auto"
            />
            
            <p className="text-xs text-gray-500 mt-6">
              This may take a few moments depending on your Instagram account size and network speed
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <ContentHeader onCreateNew={handleCreateNew} />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Content</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {error.includes('timeout') || error.includes('Network Error') 
                ? 'The request is taking longer than expected. This might be due to Instagram API delays.'
                : error.includes('401') || error.includes('Unauthorized')
                ? 'Your Instagram connection needs to be refreshed. Please reconnect your account.'
                : 'We encountered an issue while loading your content. Please try again.'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  fetchContent();
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
              
              {error.includes('401') || error.includes('Unauthorized') && (
                <button
                  onClick={() => window.location.href = '/instagram-accounts'}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Reconnect Instagram
                </button>
              )}
            </div>
            
            {error.includes('timeout') && (
              <p className="text-xs text-gray-500 mt-4">
                💡 Tip: Instagram API can be slow during peak hours. Try again in a few minutes.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Ensure content is an array with null checking
  const contentArray = Array.isArray(content) ? content : [];
  

  return (
    <div className="space-y-6">
      <ContentHeader onCreateNew={handleCreateNew} />
      
      {/* Content Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <ContentStats />
          <ContentList
            content={contentArray}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPublish={handlePublish}
            onCreateNew={handleCreateNew}
          />
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