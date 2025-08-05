# Appwrite Setup Documentation

## Overview
This project integrates Appwrite SDK for both client-side and server-side operations to support a Reddit clone built with Nuxt.js.

## Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure the following variables:

```bash
# Appwrite Configuration
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1  # Your Appwrite endpoint
APPWRITE_PROJECT_ID=your-project-id-here        # Your Appwrite project ID
APPWRITE_API_KEY=your-api-key-here              # Server-side API key

# Database Configuration
APPWRITE_DATABASE_ID=your-database-id           # Database ID for the Reddit clone
APPWRITE_COLLECTION_POSTS_ID=your-posts-collection-id
APPWRITE_COLLECTION_USERS_ID=your-users-collection-id
APPWRITE_COLLECTION_COMMENTS_ID=your-comments-collection-id

# Storage Configuration
APPWRITE_BUCKET_ID=your-bucket-id               # For image uploads
```

### Appwrite Project Setup

1. **Create an Appwrite Project**
   - Go to [Appwrite Cloud](https://cloud.appwrite.io) or your self-hosted instance
   - Create a new project
   - Copy the Project ID to your `.env` file

2. **Generate API Key**
   - Go to your project settings
   - Create a new API key with appropriate permissions
   - Copy the API key to your `.env` file

3. **Set up Database**
   - Create a new database
   - Create collections for:
     - `posts` - For Reddit posts
     - `users` - For user profiles
     - `comments` - For post comments
   - Configure appropriate permissions

4. **Set up Storage**
   - Create a storage bucket for image uploads
   - Configure permissions as needed

## Architecture

### Client-Side Integration
- **File**: `composables/useAppwrite.ts`
- **Purpose**: Provides Appwrite client for browser-side operations
- **Usage**: Authentication, real-time subscriptions, client-side data operations

```typescript
// Usage in components
const appwrite = useAppwrite()
const user = await appwrite.account.get()
```

### Server-Side Integration
- **File**: `server/utils/appwrite.ts`
- **Purpose**: Provides Appwrite client for server-side operations
- **Usage**: SSR data fetching, admin operations, API endpoints

```typescript
// Usage in server API routes
const appwrite = getServerAppwrite()
const posts = await appwrite.databases.listDocuments('database-id', 'posts-collection-id')
```

### Configuration
- **File**: `nuxt.config.ts`
- **Purpose**: Configures runtime variables for both client and server
- **Features**: Environment variable mapping, type safety

## Features

### Connection Health Check
- **Endpoint**: `/api/health`
- **Purpose**: Monitors Appwrite connection status
- **Response**: Connection status, configuration details, error information

### Error Handling
- Client-side error handling in composables
- Server-side error handling in API routes
- Connection failure recovery mechanisms
- User-friendly error messages

### Security
- API keys are server-side only
- Public configuration exposed safely to client
- Environment variable validation
- Secure client initialization

## Usage Examples

### Client-Side Data Fetching
```typescript
// In a Vue component
const { data: posts } = await useLazyAsyncData('posts', async () => {
  const appwrite = useAppwrite()
  const config = useRuntimeConfig()
  
  return await appwrite.databases.listDocuments(
    config.public.appwriteDatabaseId,
    config.public.appwriteCollectionPostsId
  )
})
```

### Server-Side API Route
```typescript
// server/api/posts.get.ts
export default defineEventHandler(async (event) => {
  const appwrite = getServerAppwrite()
  const config = useRuntimeConfig()
  
  try {
    const posts = await appwrite.databases.listDocuments(
      config.public.appwriteDatabaseId,
      config.public.appwriteCollectionPostsId
    )
    return posts
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch posts'
    })
  }
})
```

## Testing

### Health Check
Visit `/api/health` to check Appwrite connection status and configuration.

### Development Server
Run `npm run dev` and navigate to the home page to see connection status.

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check if `APPWRITE_ENDPOINT` is correct
   - Verify `APPWRITE_PROJECT_ID` matches your project
   - Ensure API key has correct permissions

2. **Environment Variables Not Loaded**
   - Verify `.env` file exists in project root
   - Check variable names match exactly
   - Restart development server after changes

3. **CORS Issues**
   - Add your domain to Appwrite project settings
   - Include `localhost:3000` for development

4. **API Key Permissions**
   - Ensure API key has required scopes
   - Check database and collection permissions

### Error Messages
- "Appwrite client initialization failed" - Check endpoint and project ID
- "Failed to check Appwrite connection" - API key or network issues
- Configuration errors logged to console with details

## Next Steps

1. Implement authentication flows
2. Create data models for posts, users, comments
3. Set up real-time subscriptions
4. Implement file upload functionality
5. Add proper error boundaries and loading states