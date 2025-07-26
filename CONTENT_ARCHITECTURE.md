# Content Architecture

## Overview

The Instagram Store app now uses a hybrid content architecture that prioritizes Instagram content while maintaining a local database for drafts and scheduled posts.

## Content Sources

### 1. Instagram Content (Primary)
- **Source**: Real-time data from Instagram Graph API
- **Purpose**: Display published posts, insights, and engagement metrics
- **Sync**: Automatic sync every 30 minutes, manual sync available
- **Storage**: Cached locally for offline access and performance

### 2. Local Database Content (Secondary)
- **Source**: User-created drafts and scheduled posts
- **Purpose**: Content planning, scheduling, and unpublished work
- **Storage**: Permanent local storage
- **Features**: Full CRUD operations

## API Endpoints

### Main Content Endpoints

#### GET `/api/content`
- **Purpose**: Get combined content (Instagram + local)
- **Query Parameters**:
  - `source`: `all` | `instagram` | `local` (default: `all`)
  - `limit`: Number of items to return (default: 25)
  - `sync`: `auto` | `manual` (default: `auto`)

#### GET `/api/content/instagram`
- **Purpose**: Get only Instagram content
- **Response**: Real-time Instagram posts with insights

#### GET `/api/content/local`
- **Purpose**: Get only local database content
- **Response**: Drafts and scheduled posts

### Sync Management

#### POST `/api/content/sync`
- **Purpose**: Manually trigger Instagram content sync
- **Response**: Sync results and statistics

#### GET `/api/content/sync/status`
- **Purpose**: Check sync status and last sync time
- **Response**: Sync metadata

#### GET `/api/content/stats`
- **Purpose**: Get content statistics
- **Response**: Aggregated stats by source

### Content Management

#### POST `/api/content`
- **Purpose**: Create new draft or scheduled post
- **Body**: Content data
- **Response**: Created content with `source: 'local'`

#### PUT `/api/content/:id`
- **Purpose**: Update local content
- **Body**: Updated content data
- **Response**: Updated content

#### DELETE `/api/content/:id`
- **Purpose**: Delete local content
- **Response**: Deletion confirmation

#### DELETE `/api/content/cleanup`
- **Purpose**: Clean up old Instagram content
- **Query Parameters**: `daysOld` (default: 90)

## Content Model

### Fields

```javascript
{
  userId: ObjectId,           // User who owns the content
  title: String,              // Content title
  description: String,        // Content description
  type: String,              // 'post' | 'story' | 'reel' | 'carousel'
  content: String,           // Main content text
  mediaUrls: [String],       // Media file URLs
  hashtags: [String],        // Hashtags
  location: String,          // Location tag
  scheduledDate: Date,       // Scheduled date
  scheduledTime: String,     // Scheduled time
  isPublished: Boolean,      // Publication status
  publishedAt: Date,         // Publication timestamp
  source: String,            // 'instagram' | 'local'
  instagramId: String,       // Instagram post ID
  permalink: String,         // Instagram permalink
  instagramMediaType: String, // Instagram media type
  thumbnailUrl: String,      // Video thumbnail URL
  stats: {                   // Engagement statistics
    likes: Number,
    comments: Number,
    shares: Number,
    reach: Number,
    impressions: Number,
    engagement: Number,
    saved: Number
  },
  insights: {                // Instagram insights
    impressions: Number,
    reach: Number,
    engagement: Number,
    saved: Number,
    videoViews: Number,
    videoViewRate: Number
  },
  status: String,            // 'draft' | 'scheduled' | 'published' | 'failed'
  errorMessage: String       // Error message if failed
}
```

## Sync Service

### Features
- **Automatic Sync**: Every 30 minutes
- **Manual Sync**: On-demand synchronization
- **Error Handling**: Graceful fallback to cached data
- **Insights Fetching**: Real-time engagement metrics
- **Cleanup**: Automatic cleanup of old content

### Methods

```javascript
// Sync Instagram content to local database
await contentSyncService.syncInstagramContent(userId)

// Get combined content
await contentSyncService.getCombinedContent(userId, options)

// Get content statistics
await contentSyncService.getContentStats(userId)

// Check if sync is needed
contentSyncService.isSyncNeeded(userId)

// Manual sync trigger
await contentSyncService.triggerSync(userId)

// Cleanup old content
await contentSyncService.cleanupOldContent(userId, daysOld)
```

## Best Practices

### 1. Content Fetching
- Always use the main `/api/content` endpoint for general content display
- Use specific endpoints (`/instagram`, `/local`) for filtered views
- Implement proper error handling for sync failures

### 2. Content Creation
- Use local database for drafts and scheduled posts
- Publish to Instagram using the publish endpoint
- Handle Instagram API rate limits gracefully

### 3. Performance
- Cache Instagram content locally for faster access
- Implement pagination for large content lists
- Use sync status to show data freshness

### 4. User Experience
- Show sync status in the UI
- Provide manual sync options
- Display content source indicators
- Handle offline scenarios gracefully

## Migration Notes

### From Previous Version
- Content endpoints now return structured responses with source information
- Instagram content is automatically synced and cached
- Local database is used primarily for drafts and scheduling
- New sync management endpoints available

### Breaking Changes
- Content response format changed to include `source` and metadata
- Instagram content is now cached locally instead of fetched on-demand
- Sync status is included in content responses

## Future Enhancements

1. **Multi-Platform Support**: Extend to other social platforms
2. **Advanced Analytics**: Cross-platform content performance
3. **Content Templates**: Reusable content structures
4. **Bulk Operations**: Mass content management
5. **Webhook Integration**: Real-time content updates 