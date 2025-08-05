# Database Schema Documentation

## Overview
This document describes the Appwrite database schema for the nested comment system in the n8n-nuxt-reddit-clone project.

## Collections

### Comments Collection

The comments collection implements a self-referencing structure that supports nested comments with performance optimizations.

#### Attributes

| Attribute | Type | Size | Required | Description |
|-----------|------|------|----------|-------------|
| `content` | string | 10000 | ✅ | Comment content (supports markdown) |
| `authorId` | string | 36 | ✅ | UUID of the comment author |
| `postId` | string | 36 | ✅ | UUID of the post this comment belongs to |
| `parentCommentId` | string | 36 | ❌ | UUID of parent comment (null for top-level) |
| `createdAt` | datetime | - | ✅ | When the comment was created |
| `updatedAt` | datetime | - | ✅ | When the comment was last updated |
| `upvotes` | integer | - | ✅ | Number of upvotes (default: 0) |
| `downvotes` | integer | - | ✅ | Number of downvotes (default: 0) |
| `depth` | integer | - | ✅ | Nesting depth level (default: 0) |
| `childCount` | integer | - | ✅ | Total children count (default: 0) |
| `isDeleted` | boolean | - | ✅ | Soft delete flag (default: false) |
| `editedAt` | datetime | - | ❌ | When the comment was edited |
| `path` | string | 1000 | ✅ | Materialized path for tree queries |
| `score` | integer | - | ✅ | Computed score (upvotes - downvotes) |

#### Indexes

| Index Name | Type | Attributes | Purpose |
|------------|------|------------|---------|
| `postId_parentCommentId` | key | [`postId`, `parentCommentId`] | Get comments for a post/parent |
| `postId_score_createdAt` | key | [`postId`, `score` ↓, `createdAt` ↓] | Sort comments by score |
| `authorId_createdAt` | key | [`authorId`, `createdAt` ↓] | Get user's comments |
| `path` | key | [`path`] | Tree structure queries |
| `parentCommentId_score` | key | [`parentCommentId`, `score` ↓] | Sort replies by score |
| `postId_depth_score` | key | [`postId`, `depth`, `score` ↓] | Depth-limited queries |
| `isDeleted_postId` | key | [`isDeleted`, `postId`] | Filter deleted comments |
| `content_fulltext` | fulltext | [`content`] | Search comment content |

#### Security Rules

```javascript
// Collection-level permissions
permissions: [
  'read("any")',      // Anyone can read comments
  'create("users")',  // Only authenticated users can create
  'update("users")',  // Only authenticated users can update
  'delete("users")'   // Only authenticated users can delete
]

// Document-level permissions (implemented in application logic)
// - Only comment authors can update/delete their own comments
// - Rate limiting for comment creation
// - Content moderation rules
```

### Comment Votes Collection

Separate collection for tracking individual votes on comments.

#### Attributes

| Attribute | Type | Size | Required | Description |
|-----------|------|------|----------|-------------|
| `commentId` | string | 36 | ✅ | UUID of the comment being voted on |
| `userId` | string | 36 | ✅ | UUID of the user casting the vote |
| `voteType` | string | 20 | ✅ | Either "upvote" or "downvote" |
| `createdAt` | datetime | - | ✅ | When the vote was cast |

#### Indexes

| Index Name | Type | Attributes | Purpose |
|------------|------|------------|---------|
| `userId_commentId_unique` | unique | [`userId`, `commentId`] | One vote per user per comment |
| `commentId_voteType` | key | [`commentId`, `voteType`] | Count votes for a comment |
| `userId_createdAt` | key | [`userId`, `createdAt` ↓] | Get user's voting history |
| `voteType_createdAt` | key | [`voteType`, `createdAt` ↓] | Analytics queries |

#### Security Rules

```javascript
// Collection-level permissions
permissions: [
  'read("users")',    // Only authenticated users can read votes
  'create("users")',  // Only authenticated users can vote
  'update("users")',  // Users can change their vote
  'delete("users")'   // Users can remove their vote
]

// Document-level permissions
// - Users can only see their own votes
// - Users can only modify their own votes
```

## Performance Optimizations

### 1. Materialized Path
- Each comment stores its full path in the tree (e.g., "1/5/12")
- Enables efficient queries for entire subtrees
- Allows quick depth calculations

### 2. Depth Tracking
- Explicit `depth` attribute prevents deep recursion
- Enables depth-limited queries for performance
- Useful for UI pagination

### 3. Child Count Caching
- `childCount` stores total descendants count
- Enables UI features like "Show 5 more replies"
- Updated when comments are added/removed

### 4. Score Denormalization
- Pre-computed `score` (upvotes - downvotes)
- Enables efficient sorting without aggregation
- Updated when votes change

### 5. Soft Delete
- `isDeleted` flag preserves thread structure
- Deleted comments show as "[deleted]"
- Child comments remain visible

## Query Patterns

### Get Top-Level Comments for a Post
```typescript
Query.equal('postId', postId),
Query.equal('parentCommentId', 'null'),
Query.equal('isDeleted', false),
Query.orderDesc('score'),
Query.limit(20)
```

### Get Replies to a Comment
```typescript
Query.equal('parentCommentId', commentId),
Query.equal('isDeleted', false),
Query.orderDesc('score'),
Query.limit(10)
```

### Get Comment Thread (with path)
```typescript
Query.startsWith('path', commentPath),
Query.equal('isDeleted', false),
Query.orderAsc('path')
```

### Search Comments
```typescript
Query.search('content', searchTerm),
Query.equal('postId', postId),
Query.equal('isDeleted', false)
```

## Migration Strategy

The migration script handles:

1. **Path Calculation**: Builds materialized paths for existing comments
2. **Depth Updates**: Calculates and sets depth values
3. **Child Count**: Computes total descendant counts
4. **Score Migration**: Calculates scores from vote counts
5. **Data Cleanup**: Fixes null values and missing timestamps

## Rate Limiting Considerations

To prevent spam and abuse:

1. **Comment Creation**: Max 10 comments per minute per user
2. **Vote Changes**: Max 100 votes per minute per user
3. **Edit Frequency**: Max 5 edits per comment per hour
4. **Depth Limits**: Max 10 levels of nesting

## Monitoring and Analytics

Key metrics to track:

1. **Comment Volume**: Comments per post/day
2. **Engagement**: Average replies per comment
3. **Thread Depth**: Distribution of comment depths
4. **Vote Patterns**: Upvote/downvote ratios
5. **Performance**: Query response times

## Future Enhancements

Potential improvements:

1. **Comment Threading**: Visual thread indicators
2. **Mention System**: @username notifications
3. **Rich Media**: Image/video embeds in comments
4. **Moderation**: Automated content filtering
5. **Real-time**: Live comment updates