# Appwrite Database Setup Guide

This guide will help you set up the required database collections for the realtime comments feature.

## Prerequisites

1. Create an Appwrite project at [cloud.appwrite.io](https://cloud.appwrite.io) or run Appwrite locally
2. Note your Project ID from the Appwrite console

## Database Collections Setup

### 1. Create Database

1. Go to your Appwrite console
2. Navigate to "Databases"
3. Click "Create Database"
4. Name it (e.g., "reddit-clone")
5. Note the Database ID

### 2. Comments Collection

Create a collection named `comments` with the following attributes:

| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|-------|
| postId | String | 255 | Yes | - | No |
| userId | String | 255 | Yes | - | No |
| content | String | 5000 | Yes | - | No |
| parentId | String | 255 | No | - | No |
| votes | Integer | - | No | 0 | No |

**Indexes:**
- `postId` (key: postId, type: key, attributes: postId)
- `parentId` (key: parentId, type: key, attributes: parentId)

**Permissions:**
- Read: `role:all`
- Create: `role:authenticated` 
- Update: `role:authenticated`
- Delete: `role:authenticated`

### 3. Votes Collection

Create a collection named `votes` with the following attributes:

| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|-------|
| commentId | String | 255 | Yes | - | No |
| userId | String | 255 | Yes | - | No |
| type | String | 10 | Yes | - | No |

**Indexes:**
- `commentId` (key: commentId, type: key, attributes: commentId)
- `userId_commentId` (key: userId_commentId, type: unique, attributes: userId, commentId)

**Permissions:**
- Read: `role:all`
- Create: `role:authenticated`
- Update: `role:authenticated`
- Delete: `role:authenticated`

### 4. Posts Collection (Optional)

Create a collection named `posts` for demo purposes:

| Attribute | Type | Size | Required | Default | Array |
|-----------|------|------|----------|---------|-------|
| title | String | 255 | Yes | - | No |
| content | String | 10000 | No | - | No |
| userId | String | 255 | Yes | - | No |
| votes | Integer | - | No | 0 | No |

**Permissions:**
- Read: `role:all`
- Create: `role:authenticated`
- Update: `role:authenticated`
- Delete: `role:authenticated`

## Environment Configuration

1. Copy `.env.example` to `.env`
2. Fill in your Appwrite configuration:

```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id-here
APPWRITE_DATABASE_ID=your-database-id-here
APPWRITE_COMMENTS_COLLECTION_ID=comments
APPWRITE_VOTES_COLLECTION_ID=votes
APPWRITE_POSTS_COLLECTION_ID=posts
```

## Testing the Setup

1. Run `npm run dev`
2. Open http://localhost:3000
3. The connection status should show "Connected" if everything is configured correctly
4. Try adding a comment - it should appear in your Appwrite database
5. Vote on comments to test realtime vote updates

## Authentication Setup (Optional)

For user authentication, set up Appwrite Auth:

1. Go to "Auth" in your Appwrite console
2. Enable desired authentication methods (Email/Password, OAuth, etc.)
3. Update the `current-user-id` placeholders in the composables with actual user IDs

## Realtime Features

Once configured, you'll have:

- ✅ Live comment updates across all connected clients
- ✅ Real-time vote score changes
- ✅ Connection status monitoring
- ✅ Offline action queueing
- ✅ Browser notifications for replies
- ✅ Automatic reconnection with exponential backoff

## Troubleshooting

### Connection Issues
- Check your Project ID and endpoint URL
- Verify CORS settings in Appwrite console
- Ensure your domain is added to the platform list

### Permission Errors
- Verify collection permissions are set correctly
- Make sure `role:all` has read access for public viewing
- Ensure `role:authenticated` has create/update/delete access

### Realtime Not Working
- Check that realtime is enabled in your Appwrite project
- Verify the collection IDs match your environment variables
- Ensure your browser supports WebSockets