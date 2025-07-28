# Instagram Token Management

## Overview

This document explains how Instagram access tokens are managed in the application, including storage, expiration tracking, and automatic refresh.

## Token Storage

### User Model Schema

The `User` model now includes proper token management fields:

```javascript
{
  accessToken: String,           // Instagram access token
  refreshToken: String,          // Instagram refresh token (if available)
  tokenExpiresIn: Number,        // Token expiration time in seconds
  lastTokenRefresh: Date,        // When the token was last refreshed
  tokenExpiresAt: Date,         // Calculated expiration date
}
```

### Automatic Expiration Calculation

The User model includes a pre-save middleware that automatically calculates the token expiration date:

```javascript
userSchema.pre('save', function(next) {
  if (this.tokenExpiresIn && this.lastTokenRefresh) {
    this.tokenExpiresAt = new Date(this.lastTokenRefresh.getTime() + (this.tokenExpiresIn * 1000));
  }
  this.updatedAt = new Date();
  next();
});
```

## Token Validation Methods

The User model includes helper methods to check token status:

### `isTokenExpired()`
Returns `true` if the token is expired or will expire within 24 hours.

### `needsTokenRefresh()`
Returns `true` if the token will expire within 7 days.

## Automatic Token Refresh

### Cron Job Configuration

The application runs a daily cron job at 4:00 AM to check and refresh tokens:

```javascript
// Runs every day at 4:00 AM
cron.schedule('0 4 * * *', async () => {
  // Check for tokens that need refresh
});
```

### Refresh Criteria

Tokens are refreshed if they meet any of these criteria:
- Expire within 7 days
- No expiration date set
- Never been refreshed before

### Manual Refresh

You can manually trigger token refresh using the API endpoint:

```
GET /api/cron/refresh-instagram-tokens
```

Response:
```json
{
  "refreshed": 2,
  "failed": 0,
  "invalid": 1,
  "total": 3,
  "message": "Refreshed 2 tokens, 0 failed, 1 invalid tokens"
}
```

## Token Exchange Process

### Short-lived to Long-lived Token Exchange

Instagram provides two types of access tokens:
- **Short-lived tokens**: Expire in 1 hour
- **Long-lived tokens**: Expire in 60 days

The OAuth flow now automatically exchanges short-lived tokens for long-lived tokens:

```javascript
// Exchange short-lived token for long-lived token
const longLivedTokenResponse = await axios.get('https://graph.instagram.com/access_token', {
  params: {
    grant_type: 'ig_exchange_token',
    client_secret: process.env.INSTAGRAM_APP_SECRET,
    access_token: shortLivedToken
  }
});

const longLivedToken = longLivedTokenResponse.data.access_token;
const expiresIn = longLivedTokenResponse.data.expires_in;
```

### Manual Token Exchange

For existing users with short-lived tokens, use the exchange endpoint:

```
GET /api/cron/exchange-short-lived-tokens
```

This will:
1. Find all users with Instagram tokens
2. Test if tokens are valid
3. Exchange short-lived tokens for long-lived tokens
4. Update the database with new token information

## Token Status Checking

### API Endpoint

Check token validity and get detailed information:

```
GET /api/instagram/token-status
```

Response:
```json
{
  "isValid": true,
  "tokenInfo": {
    "app_id": "123456789",
    "application": "Your App Name",
    "expires_at": 1234567890,
    "is_valid": true,
    "scopes": ["instagram_basic", "instagram_content_publish"],
    "user_id": "123456789"
  },
  "message": "Token is valid"
}
```

## Instagram API Service Methods

### `testToken()`
Tests if the current token is valid by making a simple API call.

### `isTokenValid()`
Returns `true` if the token is valid, `false` otherwise.

### `getTokenInfo()`
Returns detailed token information including expiration, scopes, and permissions.

## Testing Token Storage

Run the test script to verify token storage:

```bash
node test-token-storage.js
```

This will show:
- All users with Instagram tokens
- Token expiration status
- Users needing refresh
- Detailed token information

## Common Issues and Solutions

### Token Expires in 1 Hour

**Problem**: Instagram tokens are expiring much sooner than expected.

**Root Cause**: You're storing short-lived access tokens instead of long-lived tokens.

**Solutions**:
1. **For new users**: The OAuth flow now automatically exchanges short-lived tokens for long-lived tokens
2. **For existing users**: Use the exchange endpoint to convert existing short-lived tokens:
   ```
   GET /api/cron/exchange-short-lived-tokens
   ```
3. **Manual exchange**: If you have existing short-lived tokens, they need to be exchanged using the Instagram API:
   ```
   GET https://graph.instagram.com/access_token
   ?grant_type=ig_exchange_token
   &client_secret=YOUR_APP_SECRET
   &access_token=SHORT_LIVED_TOKEN
   ```

### Token Refresh Fails

**Problem**: Automatic token refresh is failing.

**Solutions**:
1. Check if the user has revoked permissions
2. Verify the app is still approved by Instagram
3. Check if the token has been invalidated
4. Re-authenticate the user if necessary

### Missing Token Expiration Data

**Problem**: `tokenExpiresIn` or `lastTokenRefresh` fields are missing.

**Solutions**:
1. Re-authenticate the user to get fresh token data
2. Manually trigger token refresh
3. Check if the OAuth callback is properly setting these fields

## Best Practices

1. **Always check token validity** before making API calls
2. **Implement proper error handling** for expired tokens
3. **Use the refresh endpoint** when tokens are about to expire
4. **Monitor token status** regularly
5. **Provide clear user feedback** when re-authentication is needed

## Instagram Token Types

### Short-lived Access Token
- Expires in 1 hour
- Used for initial authentication
- Must be exchanged for long-lived token

### Long-lived Access Token
- Expires in 60 days
- Can be refreshed for another 60 days
- Used for ongoing API access

### Refresh Token
- Used to get new long-lived tokens
- Does not expire (unless revoked)
- Should be stored securely

## Security Considerations

1. **Store tokens securely** - Use environment variables and encrypted storage
2. **Limit token scope** - Only request necessary permissions
3. **Monitor token usage** - Log and alert on unusual activity
4. **Implement proper logout** - Clear tokens when users log out
5. **Regular security audits** - Review token permissions and usage 