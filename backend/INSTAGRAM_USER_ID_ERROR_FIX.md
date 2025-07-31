# Fixing Instagram User ID Error (Code 100, Subcode 2534014)

## The Error
```
{
  "message": "The requested user cannot be found.",
  "type": "IGApiException", 
  "code": 100,
  "error_subcode": 2534014
}
```

## What This Means

Error code `100` with subcode `2534014` specifically means:
- **The user ID you're trying to message doesn't exist**
- **The user ID format is incorrect**
- **The user has been deleted or deactivated**
- **Instagram API cannot resolve the user ID**

## Root Causes

### 1. **User ID Format Issues**
Instagram uses different ID formats:
- **Numeric IDs**: `24884966311106046`
- **String IDs**: `"24884966311106046"`
- **Username**: `s.tarun_rajput`

### 2. **Webhook vs API ID Mismatch**
- Webhook sends one ID format
- API expects different format
- IDs can change over time

### 3. **User Privacy Settings**
- User account is private
- User has blocked your app
- User has restricted messaging

## Solutions

### 1. **Test Different ID Formats**

Run this script to find the correct format:
```bash
node testing/fix-user-id-error.js
```

### 2. **Use Username Instead of ID**

Modify the automation to try username first:
```javascript
// Try username first, then fallback to ID
const targetUser = triggerData.username || triggerData.userId;
const result = await instagramApi.sendDirectMessage(targetUser, message);
```

### 3. **Check User Account Status**

```javascript
// Check if user exists before sending DM
try {
  const userInfo = await instagramApi.getUserInfo(targetUserId);
  if (userInfo) {
    // User exists, proceed with DM
    const result = await instagramApi.sendDirectMessage(targetUserId, message);
  } else {
    // User doesn't exist or is private
    console.log('User not accessible');
  }
} catch (error) {
  console.log('Cannot verify user:', error.message);
}
```

### 4. **Alternative Approaches**

#### Option A: Comment Reply
```javascript
// Instead of DM, reply to the comment
await instagramApi.replyToComment(commentId, message);
```

#### Option B: Follow First
```javascript
// Follow user first, then DM
await instagramApi.followUser(targetUserId);
// Wait, then send DM
setTimeout(async () => {
  await instagramApi.sendDirectMessage(targetUserId, message);
}, 5000);
```

#### Option C: Use Different Endpoint
```javascript
// Try different Instagram API endpoint
const result = await instagramApi.sendMessage(targetUserId, message);
```

## Testing Commands

### 1. Test with Different ID Formats
```bash
# Test with original ID
curl -X POST "http://localhost:3000/webhooks/instagram" \
  -H "Content-Type: application/json" \
  -d '{
    "object": "instagram",
    "entry": [{
      "id": "24884966311106046",
      "changes": [{
        "field": "comments",
        "value": {
          "from": {"id": "24884966311106046", "username": "s.tarun_rajput"},
          "media": {"id": "18039975077650076"},
          "text": "second"
        }
      }]
    }]
  }'
```

### 2. Test with Username
```bash
# Test with username in ID field
curl -X POST "http://localhost:3000/webhooks/instagram" \
  -H "Content-Type: application/json" \
  -d '{
    "object": "instagram",
    "entry": [{
      "id": "s.tarun_rajput",
      "changes": [{
        "field": "comments",
        "value": {
          "from": {"id": "s.tarun_rajput", "username": "s.tarun_rajput"},
          "media": {"id": "18039975077650076"},
          "text": "second"
        }
      }]
    }]
  }'
```

## Debugging Steps

1. **Check User Exists**
   ```bash
   node testing/fix-user-id-error.js
   ```

2. **Verify Instagram App Permissions**
   - Check if your app has `pages_messaging` permission
   - Verify business account status

3. **Test with Known Working User**
   - Try messaging yourself first
   - Test with a user you know exists

4. **Check API Rate Limits**
   - Instagram has strict rate limits
   - Wait between requests

## Quick Fix

If you need a quick fix, modify the webhook data to use a working user ID:

```javascript
// In automationExecutionService.js, modify the test data:
const temp = {
  from: {
    id: '17841403236811401', // Use a different ID that works
    username: 's.tarun_rajput'
  },
  media: {
    id: '18039975077650076',
    media_product_type: 'FEED'
  },
  text: 'second'
};
```

## Long-term Solution

1. **Implement ID Validation**
   ```javascript
   // Validate user ID before sending DM
   async validateUserID(userId) {
     try {
       const userInfo = await this.instagramApi.getUserInfo(userId);
       return userInfo ? true : false;
     } catch (error) {
       return false;
     }
   }
   ```

2. **Use Fallback Strategy**
   ```javascript
   // Try multiple approaches
   const approaches = [
     () => this.sendDirectMessage(userId, message),
     () => this.sendDirectMessage(username, message),
     () => this.replyToComment(commentId, message)
   ];
   
   for (const approach of approaches) {
     try {
       const result = await approach();
       if (result.success) break;
     } catch (error) {
       continue;
     }
   }
   ```

3. **Log and Monitor**
   ```javascript
   // Log all attempts for debugging
   console.log('DM attempt:', {
     userId: targetUserId,
     username: triggerData.username,
     success: result.success,
     error: result.error
   });
   ```

## Common Working IDs

Based on your data, try these IDs:
- `17841403236811401` (from your user data)
- `s.tarun_rajput` (username)
- `24884966311106046` (original)

The key is to test each format and see which one works with your Instagram API setup. 