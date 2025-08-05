# Nuxt Reddit Clone with Realtime Comments

A Reddit clone built with Nuxt 3 featuring real-time comments using Appwrite's realtime subscriptions.

## Features

- ✅ **Real-time Comments**: Live updates without page refresh
- ✅ **Vote System**: Real-time vote score updates 
- ✅ **Connection Management**: Smart reconnection with exponential backoff
- ✅ **Offline Support**: Queues actions when offline and syncs on reconnect
- ✅ **Notifications**: Browser notifications for replies
- ✅ **Performance Optimized**: Batched updates and debounced realtime events
- ✅ **Error Handling**: Robust error handling and recovery

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Appwrite**:
   Create a `.env` file with your Appwrite configuration:
   ```env
   APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   APPWRITE_PROJECT_ID=your-project-id
   APPWRITE_DATABASE_ID=your-database-id
   APPWRITE_COMMENTS_COLLECTION_ID=comments
   APPWRITE_VOTES_COLLECTION_ID=votes
   APPWRITE_POSTS_COLLECTION_ID=posts
   ```

3. **Setup Appwrite Database**:
   Create the following collections in your Appwrite database:

   **Comments Collection**:
   - `postId` (string, required)
   - `userId` (string, required) 
   - `content` (string, required)
   - `parentId` (string, optional) - for replies
   - `votes` (integer, default: 0)

   **Votes Collection**:
   - `commentId` (string, required)
   - `userId` (string, required)
   - `type` (string, required) - 'up' or 'down'

4. **Development**:
   ```bash
   npm run dev
   ```

## Architecture

### Composables

- **`useAppwrite.ts`**: Core Appwrite client with connection management and subscription handling
- **`useComments.ts`**: Comment-specific logic with realtime subscriptions for a post
- **`useNotifications.ts`**: Browser notification system for replies and votes

### Components

- **`ConnectionStatus.vue`**: Shows real-time connection status
- **`Comments.vue`**: Main comments section with add comment form
- **`CommentItem.vue`**: Individual comment with voting and reply functionality

### Key Features Implementation

**Realtime Subscriptions**:
```typescript
// Subscribe to post comments
const subscribeToComments = () => {
  const channels = [`databases.${databaseId}.collections.${commentsCollectionId}.documents`]
  return subscribe(channels, handleCommentUpdate)
}
```

**Connection Management**:
- Automatic reconnection with exponential backoff
- Connection state tracking
- Subscription re-establishment on reconnect

**Offline Support**:
- Actions are queued when offline
- Automatic sync when connection is restored
- User feedback for offline state

**Performance Optimizations**:
- Debounced realtime updates (100ms)
- Batched comment updates
- Selective subscriptions (only active posts)
- Subscription cleanup on navigation

## License

MIT