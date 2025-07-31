# Enhanced Instagram Account Management

This guide explains the enhanced Instagram account functionality that fetches real-time data from the Instagram API and provides a comprehensive account information structure.

## Overview

The enhanced Instagram account system now:
- Fetches live data from Instagram Graph API
- Stores comprehensive profile information
- Provides fallback to stored data when API is unavailable
- Returns a structured object with all account details

## Enhanced Account Structure

The `getCurrentAccount` endpoint now returns an enhanced object with the following structure:

```javascript
{
  // Basic Profile Info
  username: "string",           // Instagram username
  fullName: "string",          // Full name from Instagram
  bio: "string",               // Bio/description
  profilePic: "string",        // Profile picture URL
  
  // Account Stats
  posts: "number",             // Number of posts
  followers: "string",         // Number of followers (formatted with toLocaleString())
  following: "number",         // Number of following
  
  // Account Details
  accountType: "string",       // 'BUSINESS', 'PERSONAL', 'CREATOR'
  isVerified: "boolean",       // Whether account is verified
  website: "string",           // Website URL
  email: "string",             // Email address
  phone: "string",             // Phone number
  location: "string",          // Location
  
  // Dates
  joinedDate: "Date",          // When account was created
  
  // Connection Info
  instagramId: "string",       // Instagram user ID
  connectedAt: "Date",         // When connected to this app
  lastTokenRefresh: "Date",    // Last token refresh
  tokenExpiresAt: "Date"       // Token expiration
}
```

## Database Schema Updates

The User model has been enhanced with additional Instagram profile fields:

```javascript
// Additional Instagram profile fields
instagramFullName: String,
instagramBio: String,
instagramWebsite: String,
instagramEmail: String,
instagramPhone: String,
instagramLocation: String,
instagramIsVerified: { type: Boolean, default: false },
instagramPostsCount: { type: Number, default: 0 },
instagramFollowersCount: { type: Number, default: 0 },
instagramFollowingCount: { type: Number, default: 0 },
instagramJoinedDate: Date,
```

## API Endpoints

### 1. Get Current Account (`GET /api/instagram-accounts/current`)

Fetches the latest Instagram account information with enhanced data structure.

**Response:**
```javascript
{
  username: "john_doe",
  fullName: "John Doe",
  bio: "Digital creator and entrepreneur",
  profilePic: "https://example.com/profile.jpg",
  posts: 150,
  followers: "12,500",
  following: 890,
  accountType: "BUSINESS",
  isVerified: true,
  website: "https://johndoe.com",
  email: "john@example.com",
  phone: "+1234567890",
  location: "New York, NY",
  joinedDate: "2020-01-15T00:00:00.000Z",
  instagramId: "123456789",
  connectedAt: "2023-06-01T10:30:00.000Z",
  lastTokenRefresh: "2023-12-01T15:45:00.000Z",
  tokenExpiresAt: "2024-01-01T15:45:00.000Z"
}
```

### 2. Connect Account (`POST /api/instagram-accounts/connect`)

Connects an Instagram account and fetches detailed profile information.

**Request Body:**
```javascript
{
  instagramId: "123456789",
  username: "john_doe",
  accessToken: "IGQWR...",
  refreshToken: "IGQWR...",
  profilePic: "https://example.com/profile.jpg",
  accountType: "BUSINESS"
}
```

### 3. Get Connection Status (`GET /api/instagram-accounts/status`)

Returns connection status with enhanced account information.

### 4. Get Account Analytics (`GET /api/instagram-accounts/analytics`)

Returns detailed analytics with profile and stats information.

## Instagram API Integration

The system uses the Instagram Graph API to fetch real-time data:

### New API Method: `getDetailedAccountInfo()`

```javascript
async getDetailedAccountInfo() {
  const url = `${this.baseUrl}/me`;
  const params = {
    access_token: this.accessToken,
    fields: 'id,username,account_type,media_count,followers_count,follows_count,biography,website,email,phone,location,created_time'
  };
  const response = await this.axiosInstance.get(url, { params });
  return response.data;
}
```

## Error Handling

The system includes robust error handling:

1. **API Failures**: Falls back to stored data if Instagram API is unavailable
2. **Token Expiration**: Handles expired tokens gracefully
3. **Missing Data**: Uses stored data as fallback for missing fields
4. **Network Issues**: Continues operation with cached data

## Data Flow

1. **Initial Connection**: When connecting an account, the system fetches and stores detailed profile information
2. **Regular Updates**: Each API call attempts to get fresh data from Instagram
3. **Fallback Strategy**: If API fails, uses stored data to ensure continuity
4. **Data Persistence**: Enhanced profile data is stored in the database for offline access

## Testing

Use the test file to verify functionality:

```bash
node testing/test-enhanced-account.js
```

This will:
- Connect to MongoDB
- Find a user with Instagram connected
- Test Instagram API calls
- Display current stored data
- Verify the enhanced structure

## Migration Notes

For existing installations:

1. **Database Migration**: The new fields will be automatically added to existing user documents
2. **Backward Compatibility**: Existing endpoints continue to work with enhanced data
3. **Gradual Enhancement**: Data will be populated as users reconnect their accounts or when API calls are made

## Performance Considerations

- **Caching**: Stored data reduces API calls
- **Fallback**: System remains functional even when Instagram API is down
- **Efficient Queries**: Only fetches necessary fields from Instagram API
- **Error Recovery**: Graceful degradation when API limits are reached

## Security

- **Token Management**: Secure storage and refresh of Instagram access tokens
- **Data Privacy**: Sensitive information is properly handled
- **API Limits**: Respects Instagram API rate limits
- **Error Logging**: Comprehensive error tracking without exposing sensitive data 