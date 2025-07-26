import { useState, useEffect, useCallback } from 'react';
import contentService from '../services/contentService';

export const useContent = () => {
  const [content, setContent] = useState([]);
  const [stats, setStats] = useState({
    totalContent: 0,
    published: 0,
    scheduled: 0,
    totalLikes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For development, use mock data
      const mockContent = contentService.getMockContent();
      const mockStats = contentService.getMockStats();
      
      // In production, uncomment these lines:
      // const [contentData, statsData] = await Promise.all([
      //   contentService.fetchContent(),
      //   contentService.getContentStats()
      // ]);
      
      setContent(mockContent);
      setStats(mockStats);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createContent = useCallback(async (contentData) => {
    try {
      setError(null);
      
      // For development, create mock content
      const newContent = {
        id: Date.now(),
        ...contentData,
        stats: null,
        publishedAt: null
      };
      
      // In production, uncomment this line:
      // const newContent = await contentService.createContent(contentData);
      
      setContent(prev => [...prev, newContent]);
      return newContent;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateContent = useCallback(async (contentId, contentData) => {
    try {
      setError(null);
      
      // For development, update mock content
      setContent(prev => prev.map(item => 
        item.id === contentId 
          ? { ...item, ...contentData }
          : item
      ));
      
      // In production, uncomment this line:
      // await contentService.updateContent(contentId, contentData);
      
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteContent = useCallback(async (contentId) => {
    try {
      setError(null);
      
      // For development, delete from mock content
      setContent(prev => prev.filter(item => item.id !== contentId));
      
      // In production, uncomment this line:
      // await contentService.deleteContent(contentId);
      
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const publishContent = useCallback(async (contentId) => {
    try {
      setError(null);
      
      // For development, update mock content
      setContent(prev => prev.map(item => 
        item.id === contentId 
          ? { 
              ...item, 
              isPublished: true, 
              publishedAt: new Date().toISOString(),
              stats: { likes: 0, comments: 0, shares: 0, reach: 0 }
            }
          : item
      ));
      
      // In production, uncomment this line:
      // await contentService.publishContent(contentId);
      
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    content,
    stats,
    loading,
    error,
    createContent,
    updateContent,
    deleteContent,
    publishContent,
    refetch: fetchContent
  };
}; 