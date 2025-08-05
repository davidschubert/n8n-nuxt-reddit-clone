# Appwrite Database Setup

This document describes how to set up the Appwrite database for the comment system.

## Database Structure

### Comments Collection (`comments`)

**Collection ID**: `comments`

**Attributes**:
- `content` (String, required, 10000 chars max)
- `authorId` (String, required, 36 chars max)
- `authorName` (String, required, 255 chars max)
- `postId` (String, required, 36 chars max)
- `parentId` (String, optional, 36 chars max) - null for top-level comments
- `upvotes` (Integer, default: 0)
- `downvotes` (Integer, default: 0)
- `score` (Integer, default: 0) - calculated as upvotes - downvotes
- `depth` (Integer, default: 0) - nesting level
- `childCount` (Integer, default: 0) - number of direct replies

**Indexes**:
- `postId` (Key)
- `parentId` (Key)
- `score` (Key)
- `$createdAt` (Key)

**Permissions**:
- Read: `role:all`
- Create: `role:all` (in production, limit to authenticated users)
- Update: `role:all` (in production, limit to comment author or moderators)
- Delete: `role:all` (in production, limit to comment author or moderators)

### Votes Collection (`votes`)

**Collection ID**: `votes`

**Attributes**:
- `userId` (String, required, 36 chars max)
- `commentId` (String, required, 36 chars max)
- `type` (String, required, enum: ["upvote", "downvote"])

**Indexes**:
- `userId` (Key)
- `commentId` (Key)
- `userId,commentId` (Unique) - ensures one vote per user per comment

**Permissions**:
- Read: `role:all`
- Create: `role:all` (in production, limit to authenticated users)
- Update: `role:all` (in production, limit to vote author)
- Delete: `role:all` (in production, limit to vote author)

## Setup Instructions

1. **Create Database**:
   - Go to your Appwrite console
   - Create a new database
   - Note the Database ID

2. **Create Collections**:
   - Create the `comments` collection with attributes as described above
   - Create the `votes` collection with attributes as described above

3. **Configure Permissions**:
   - Set permissions for both collections
   - For development, use `role:all`
   - For production, implement proper user authentication

4. **Environment Variables**:
   ```env
   APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   APPWRITE_PROJECT_ID=your-project-id
   APPWRITE_DATABASE_ID=your-database-id
   APPWRITE_COMMENTS_COLLECTION_ID=comments
   APPWRITE_VOTES_COLLECTION_ID=votes
   ```

## Production Considerations

### Security
- Implement user authentication
- Restrict permissions to authenticated users only
- Add validation rules for content length and format
- Implement rate limiting for comment creation

### Performance
- Consider adding pagination for large comment threads
- Implement caching for frequently accessed comments
- Add database triggers to automatically update vote counts

### Real-time Features
- The system supports Appwrite's real-time subscriptions
- Enable real-time updates for live comment notifications
- Consider implementing typing indicators for replies

### Moderation
- Add moderation flags to comment schema
- Implement comment reporting system
- Add soft delete functionality for removed comments