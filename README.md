# n8n-nuxt-reddit-clone

A Reddit clone built with Nuxt.js, n8n workflows, and Appwrite backend featuring a sophisticated nested comment system.

## Features

### Comment System
- ✅ **Nested Comments**: Self-referencing comment structure with unlimited depth
- ✅ **Performance Optimized**: Materialized paths, depth tracking, and child count caching
- ✅ **Voting System**: Separate upvote/downvote tracking with score calculation
- ✅ **Soft Delete**: Preserve thread structure when comments are deleted
- ✅ **Full-Text Search**: Search through comment content
- ✅ **Real-time Updates**: Optimized for live comment interactions

### Database Architecture
- **Appwrite Backend**: Cloud-native database with built-in security
- **Optimized Indexes**: High-performance queries for complex comment trees
- **Security Rules**: Authentication-based access control
- **Migration Support**: Scripts for data migration and schema updates

## Quick Start

### Prerequisites
- Node.js 18+ 
- Appwrite account and project
- Environment variables configured

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/davidschubert/n8n-nuxt-reddit-clone.git
cd n8n-nuxt-reddit-clone
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your Appwrite credentials
```

4. **Set up database**
```bash
npm run db:setup
```

5. **Run development server**
```bash
npm run dev
```

## Database Setup

### Environment Configuration

Create a `.env` file with your Appwrite configuration:

```env
# Appwrite Configuration
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id_here
APPWRITE_API_KEY=your_api_key_here

# Database Configuration  
APPWRITE_DATABASE_ID=reddit-clone-db
APPWRITE_COMMENTS_COLLECTION_ID=comments
APPWRITE_COMMENT_VOTES_COLLECTION_ID=comment-votes
```

### Database Initialization

Run the setup script to create collections, attributes, and indexes:

```bash
npm run db:setup
```

This will create:
- **Comments Collection**: Self-referencing structure with performance optimizations
- **Comment Votes Collection**: Separate voting system with unique constraints
- **Optimized Indexes**: For fast queries on comment trees
- **Security Rules**: Authentication-based permissions

### Data Migration

If you have existing data, run the migration script:

```bash
npm run db:migrate
```

## Usage

### Basic Comment Thread

```vue
<template>
  <CommentThread 
    :post-id="postId"
    :current-user-id="userId"
    :max-depth="5"
  />
</template>
```

### Comment Service

```typescript
import { commentService } from '~/services/comment.service'

// Create a comment
const comment = await commentService.createComment(userId, {
  content: "Great post!",
  postId: "post-123"
})

// Get comments for a post
const comments = await commentService.getCommentsForPost({
  postId: "post-123",
  limit: 20,
  sortBy: 'score'
})

// Vote on a comment
await commentService.voteComment(userId, {
  commentId: comment.id,
  voteType: 'upvote'
})
```

## Database Schema

### Comments Collection

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique comment identifier |
| `content` | string | Comment content (markdown supported) |
| `authorId` | string | Author user ID |
| `postId` | string | Parent post ID |
| `parentCommentId` | string? | Parent comment ID (null for top-level) |
| `depth` | integer | Nesting depth (0 for top-level) |
| `childCount` | integer | Total descendant count |
| `path` | string | Materialized path for tree queries |
| `score` | integer | Computed score (upvotes - downvotes) |
| `upvotes` | integer | Number of upvotes |
| `downvotes` | integer | Number of downvotes |
| `isDeleted` | boolean | Soft delete flag |
| `createdAt` | datetime | Creation timestamp |
| `updatedAt` | datetime | Last update timestamp |
| `editedAt` | datetime? | Last edit timestamp |

### Comment Votes Collection

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique vote identifier |
| `commentId` | string | Target comment ID |
| `userId` | string | Voting user ID |
| `voteType` | string | "upvote" or "downvote" |
| `createdAt` | datetime | Vote timestamp |

## Performance Features

### Optimizations
- **Materialized Paths**: Enable efficient subtree queries
- **Depth Tracking**: Prevent infinite recursion
- **Child Count Caching**: Fast UI updates for reply counts
- **Score Denormalization**: Avoid expensive aggregations
- **Strategic Indexes**: Optimized for common query patterns

### Query Patterns
- **Top-level comments**: `postId + parentCommentId=null + score DESC`
- **Comment replies**: `parentCommentId + score DESC`
- **User comments**: `authorId + createdAt DESC`
- **Thread search**: `path LIKE prefix + isDeleted=false`

## Security

### Authentication
- Comments require user authentication
- Vote operations require user authentication
- Anonymous users can read public comments

### Authorization
- Users can only edit/delete their own comments
- Vote uniqueness enforced per user per comment
- Rate limiting prevents spam

### Data Protection
- Soft delete preserves thread structure
- Audit trail with creation/update timestamps
- Input validation and sanitization

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run db:setup` | Initialize database schema |
| `npm run db:migrate` | Migrate existing data |

## Documentation

- [Database Schema](docs/database-schema.md) - Detailed schema documentation
- [API Reference](docs/api-reference.md) - Service methods and types
- [Performance Guide](docs/performance.md) - Optimization strategies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details