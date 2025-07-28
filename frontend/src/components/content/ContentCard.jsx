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
  HashtagIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  BookmarkIcon as BookmarkSolidIcon
} from '@heroicons/react/24/solid';

const ContentCard = ({ content, onEdit, onDelete, onPublish }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showAppData, setShowAppData] = useState(false);

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
    watchLists = [],
    status,
    source,
    thumbnailUrl
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
    if (!num || num === 0) return null;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Get the main content text (prefer title, then description, then content)
  const mainContent = title || description || contentText || 'No content';

  // Get Instagram stats (only show non-zero values)
  const instagramStats = {
    likes: insights.likes || stats.likes,
    comments: insights.comments || stats.comments,
    shares: stats.shares,
    saved: insights.saved,
    reach: insights.reach || stats.reach,
    impressions: insights.impressions,
    videoViews: insights.videoViews
  };

  // Filter out zero/null values for Instagram stats
  const displayInstagramStats = Object.fromEntries(
    Object.entries(instagramStats).filter(([key, value]) => value && value > 0)
  );

  // App data for flip view
  const appData = {
    status,
    performance: performance?.performanceScore || 0,
    campaigns: campaigns.length,
    automations: automations.length,
    watchLists: watchLists.length,
    lastAnalyzed: performance?.lastAnalyzed
  };

  const renderInstagramView = () => (
    <div className="flex flex-col">
      {/* Media Section */}
      <div className="relative aspect-square bg-gray-50">
        {mediaUrls?.[0] && !imageError ? (
          <div className="relative w-full h-full">
            {isVideo ? (
              <div className="relative w-full h-full">
                <video
                  src={mediaUrls[0]}
                  className="w-full h-full object-cover"
                  poster={thumbnailUrl}
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
                alt={mainContent}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            )}
            
            {/* Performance Badge */}
            {performance && (
              <div className={`absolute top-1 right-8 px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor()}`}>
                <PerformanceIcon className="h-3 w-3 inline mr-0.5" />
                {performance?.performanceScore}
              </div>
            )}

            {/* Multiple Media Indicator */}
            {mediaUrls.length > 1 && (
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                {mediaUrls.length} photos
              </div>
            )}

            {/* Source Badge */}
            {source && (
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                {source}
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
              {mainContent}
            </h3>
            {description && description !== title && (
              <p className="text-xs text-gray-600 line-clamp-2">
                {description}
              </p>
            )}
          </div>
          
          {/* Status Badge */}
          <div className="ml-2 flex-shrink-0">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              isPublished || status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isPublished || status === 'published' ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>

        {/* Engagement Stats - Only show non-zero values */}
        {Object.keys(displayInstagramStats).length > 0 && (
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              {displayInstagramStats.likes && (
                <div className="flex items-center space-x-1">
                  <HeartIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-600">{formatNumber(displayInstagramStats.likes)}</span>
                </div>
              )}
              {displayInstagramStats.comments && (
                <div className="flex items-center space-x-1">
                  <ChatBubbleLeftIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-600">{formatNumber(displayInstagramStats.comments)}</span>
                </div>
              )}
              {displayInstagramStats.shares && (
                <div className="flex items-center space-x-1">
                  <ShareIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-600">{formatNumber(displayInstagramStats.shares)}</span>
                </div>
              )}
              {displayInstagramStats.saved && (
                <div className="flex items-center space-x-1">
                  <BookmarkIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-600">{formatNumber(displayInstagramStats.saved)}</span>
                </div>
              )}
              {displayInstagramStats.reach && (
                <div className="flex items-center space-x-1">
                  <EyeIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-600">{formatNumber(displayInstagramStats.reach)}</span>
                </div>
              )}
              {displayInstagramStats.impressions && (
                <div className="flex items-center space-x-1">
                  <ChartBarIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-600">{formatNumber(displayInstagramStats.impressions)}</span>
                </div>
              )}
              {displayInstagramStats.videoViews && (
                <div className="flex items-center space-x-1">
                  <PlayIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-600">{formatNumber(displayInstagramStats.videoViews)}</span>
                </div>
              )}
            </div>
          </div>
        )}

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
              <span className="text-xs">{formatNumber(displayInstagramStats.likes) || '0'}</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
              <ChatBubbleLeftIcon className="h-5 w-5" />
              <span className="text-xs">{formatNumber(displayInstagramStats.comments) || '0'}</span>
            </button>
            
            <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors">
              <ShareIcon className="h-5 w-5" />
              <span className="text-xs">{formatNumber(displayInstagramStats.shares) || '0'}</span>
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

  const renderAppDataView = () => {
    return (
      <div className="flex flex-col">
        
        {/* Content section - exactly matching Instagram view structure */}
        <div className="p-4">
          {/* Status */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Status</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                status === 'published' ? 'bg-green-100 text-green-800' : 
                status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {status}
              </span>
            </div>
          </div>


          {/* Campaigns */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Campaigns</span>
              <button 
                className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                onClick={() => {/* TODO: Add campaign management */}}
              >
                Manage
              </button>
            </div>
            {campaigns.length > 0 ? (
              <div className="space-y-1">
                {campaigns.map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{campaign.name || `Campaign ${index + 1}`}</span>
                    <span className="text-blue-600 font-medium">Active</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500">No campaigns assigned</div>
            )}
          </div>

          {/* Automations */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Automations</span>
              <button 
                className="text-green-600 hover:text-green-800 text-xs font-medium"
                onClick={() => {/* TODO: Add automation management */}}
              >
                Manage
              </button>
            </div>
            {automations.length > 0 ? (
              <div className="space-y-1">
                {automations.map((automation, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{automation.name || `Automation ${index + 1}`}</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500">No automations assigned</div>
            )}
          </div>

          {/* Watch Lists */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Watch Lists</span>
              <button 
                className="text-purple-600 hover:text-purple-800 text-xs font-medium"
                onClick={() => {/* TODO: Add watch list management */}}
              >
                Manage
              </button>
            </div>
            {watchLists.length > 0 ? (
              <div className="space-y-1">
                {watchLists.map((watchList, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{watchList.name || `Watch List ${index + 1}`}</span>
                    <span className="text-purple-600 font-medium">Monitoring</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500">No watch lists assigned</div>
            )}
          </div>

          {/* Last Analyzed */}
          {appData.lastAnalyzed && (
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Last Analyzed</span>
                <span className="text-xs text-gray-500">
                  {new Date(appData.lastAnalyzed).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}



          {/* Quick Actions */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-2">
              <button 
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                onClick={() => {/* TODO: Add to campaign */}}
              >
                Add to Campaign
              </button>
              <button 
                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                onClick={() => {/* TODO: Create automation */}}
              >
                Create Automation
              </button>
              <button 
                className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200"
                onClick={() => {/* TODO: Add to watch list */}}
              >
                Add to Watch List
              </button>
              <button 
                className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200"
                onClick={() => onEdit && onEdit(content)}
              >
                Edit Content
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 relative">
      {/* Flip Button */}
      <button
        onClick={() => setShowAppData(!showAppData)}
        className="absolute top-1 right-1 z-10 bg-white bg-opacity-90 rounded-full p-1 shadow-sm hover:bg-opacity-100 transition-all"
        title="Toggle App Data"
      >
        <InformationCircleIcon className="h-4 w-4 text-gray-600" />
      </button>

      <div className="transition-all duration-300 ease-in-out">
        {showAppData ? renderAppDataView() : renderInstagramView()}
      </div>
    </div>
  );
};

export default ContentCard; 