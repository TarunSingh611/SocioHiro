import React, { useState } from 'react';
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  BookmarkIcon,
  EyeIcon,
  ChartBarIcon,
  PlayIcon,
  PhotoIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  MapPinIcon,
  HashtagIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  BookmarkIcon as BookmarkSolidIcon
} from '@heroicons/react/24/solid';

const ContentCard = ({ content, onEdit, onDelete, onPublish }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    _id,
    title,
    description,
    content: contentText,
    type,
    mediaUrls = [],
    stats = {},
    insights = {},
    performance = {},
    isPublished,
    publishedAt,
    instagramId,
    permalink,
    instagramMediaType,
    hashtags = [],
    location,
    campaigns = [],
    automations = [],
    watchLists = []
  } = content;

  const isVideo = type === 'reel' || instagramMediaType === 'VIDEO' || 
                  mediaUrls.some(url => url?.includes('.mp4') || url?.includes('.mov'));

  const getPerformanceColor = () => {
    if (performance?.isHighPerforming) return 'text-green-600 bg-green-50';
    if (performance?.isUnderperforming) return 'text-red-600 bg-red-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const getPerformanceIcon = () => {
    if (performance?.isHighPerforming) return ArrowTrendingUpIcon;
    if (performance?.isUnderperforming) return ArrowTrendingDownIcon;
    return ChartBarIcon;
  };

  const PerformanceIcon = getPerformanceIcon();

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Media Section */}
      <div className="relative aspect-square bg-gray-50">
        {mediaUrls?.[0] && !imageError ? (
          <div className="relative w-full h-full">
            {isVideo ? (
              <div className="relative w-full h-full">
                <video
                  src={mediaUrls[0]}
                  className="w-full h-full object-cover"
                  poster={content.thumbnailUrl}
                  controls
                  onError={handleImageError}
                />
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  <PlayIcon className="h-3 w-3 inline mr-1" />
                  Video
                </div>
              </div>
            ) : (
              <img
                src={mediaUrls[0]}
                alt={title || 'Content'}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            )}
            
            {/* Performance Badge */}
            {performance && (
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor()}`}>
                <PerformanceIcon className="h-3 w-3 inline mr-1" />
                {performance.performanceScore || 0}
              </div>
            )}

            {/* Multiple Media Indicator */}
            {mediaUrls.length > 1 && (
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                {mediaUrls.length} photos
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <PhotoIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
              {title || 'Untitled Content'}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-2">
              {description || contentText || 'No description'}
            </p>
          </div>
          
          {/* Status Badge */}
          <div className="ml-2 flex-shrink-0">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <HeartIcon className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-600">{formatNumber(stats.likes)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ChatBubbleLeftIcon className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-600">{formatNumber(stats.comments)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ShareIcon className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-600">{formatNumber(stats.shares)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookmarkIcon className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-600">{formatNumber(stats.saved)}</span>
            </div>
            {insights.reach > 0 && (
              <div className="flex items-center space-x-1">
                <EyeIcon className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-600">{formatNumber(insights.reach)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Hashtags */}
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {hashtags.slice(0, 3).map((tag, index) => (
              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                <HashtagIcon className="h-2 w-2 mr-1" />
                {tag}
              </span>
            ))}
            {hashtags.length > 3 && (
              <span className="text-xs text-gray-500">+{hashtags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Associations */}
        <div className="flex flex-wrap gap-2 mb-3">
          {campaigns.length > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
              {campaigns.length} Campaign{campaigns.length > 1 ? 's' : ''}
            </span>
          )}
          {automations.length > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700">
              {automations.length} Automation{automations.length > 1 ? 's' : ''}
            </span>
          )}
          {watchLists.length > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-50 text-purple-700">
              {watchLists.length} Watch List{watchLists.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            {publishedAt && (
              <div className="flex items-center space-x-1">
                <CalendarIcon className="h-3 w-3" />
                <span>{new Date(publishedAt).toLocaleDateString()}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center space-x-1">
                <MapPinIcon className="h-3 w-3" />
                <span>{location}</span>
              </div>
            )}
            {instagramId && (
              <span>ID: {instagramId}</span>
            )}
          </div>
          
          {permalink && (
            <a
              href={permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              View on Instagram
            </a>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
            >
              {isLiked ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
              <span className="text-xs">{formatNumber(stats.likes)}</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
              <ChatBubbleLeftIcon className="h-5 w-5" />
              <span className="text-xs">{formatNumber(stats.comments)}</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors">
              <ShareIcon className="h-5 w-5" />
              <span className="text-xs">{formatNumber(stats.shares)}</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="text-gray-500 hover:text-yellow-500 transition-colors"
            >
              {isSaved ? (
                <BookmarkSolidIcon className="h-5 w-5 text-yellow-500" />
              ) : (
                <BookmarkIcon className="h-5 w-5" />
              )}
            </button>
            
            {onEdit && (
              <button
                onClick={() => onEdit(content)}
                className="text-gray-500 hover:text-blue-500 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard; 