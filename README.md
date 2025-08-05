# n8n-nuxt-reddit-clone

A Reddit clone built with Nuxt.js and Appwrite, featuring post management with CRUD operations, content sanitization, and comprehensive validation.

## Features

- ✅ **Post Management**: Create, read, update, and delete posts
- ✅ **Appwrite Integration**: Secure database operations with Appwrite
- ✅ **Input Validation**: Comprehensive validation for post data
- ✅ **Content Sanitization**: XSS prevention and content cleaning
- ✅ **Error Handling**: Robust error handling with user-friendly messages
- ✅ **Performance Optimized**: Efficient database queries and pagination
- ✅ **TypeScript Support**: Full type safety throughout the application

## Tech Stack

- **Frontend**: Nuxt.js 3 with Vue.js 3
- **Backend**: Nuxt.js API routes
- **Database**: Appwrite
- **Language**: TypeScript
- **Styling**: Custom CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- An Appwrite account and project
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd n8n-nuxt-reddit-clone
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your Appwrite configuration:
```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
APPWRITE_DATABASE_ID=your-database-id
APPWRITE_POSTS_COLLECTION_ID=posts
```

4. Set up Appwrite database:
```bash
node scripts/setup-appwrite.js
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Posts API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts (with pagination) |
| POST | `/api/posts` | Create a new post |
| GET | `/api/posts/[id]` | Get a specific post |
| PUT | `/api/posts/[id]` | Update a specific post |
| DELETE | `/api/posts/[id]` | Delete a specific post |

### Request/Response Examples

#### Create Post
```typescript
POST /api/posts
{
  "title": "My First Post",
  "content": "This is the content of my post",
  "tags": ["technology", "programming"],
  "images": ["https://example.com/image.jpg"],
  "isPublished": true
}
```

#### Response
```typescript
{
  "success": true,
  "data": {
    "$id": "unique-id",
    "title": "My First Post",
    "content": "This is the content of my post",
    "authorId": "user_placeholder",
    "$createdAt": "2023-01-01T00:00:00.000Z",
    "$updatedAt": "2023-01-01T00:00:00.000Z",
    "upvotes": 0,
    "downvotes": 0,
    "commentCount": 0,
    "tags": ["technology", "programming"],
    "images": ["https://example.com/image.jpg"],
    "isPublished": true
  }
}
```

## Post Data Model

```typescript
interface Post {
  $id?: string           // Appwrite document ID
  title: string          // Post title (max 200 chars)
  content: string        // Post content (max 10,000 chars)
  authorId: string       // Author identifier
  $createdAt?: string    // Creation timestamp
  $updatedAt?: string    // Last update timestamp
  upvotes: number        // Number of upvotes
  downvotes: number      // Number of downvotes
  commentCount: number   // Number of comments
  tags: string[]         // Post tags (max 10)
  images: string[]       // Image URLs (max 5)
  isPublished: boolean   // Publication status
}
```

## Security Features

### Input Validation
- Title: Required, max 200 characters
- Content: Required, max 10,000 characters
- Tags: Optional, max 10 tags
- Images: Optional, max 5 image URLs

### Content Sanitization
- XSS prevention through HTML tag removal
- Script and iframe tag filtering
- Event handler removal
- JavaScript protocol filtering

### Security Headers
- Content sanitization on all text inputs
- URL validation for images
- Tag length and count validation

## Performance Optimizations

### Database
- Indexed queries for faster retrieval
- Pagination support for large datasets
- Efficient filtering by publication status

### Caching
- Client-side caching with Nuxt.js
- Optimized API responses

## Development

### Project Structure
```
├── assets/css/          # Stylesheets
├── lib/                 # Appwrite client configurations
├── pages/               # Nuxt.js pages
├── scripts/             # Setup and utility scripts
├── server/api/posts/    # API routes for posts
├── types/               # TypeScript type definitions
└── utils/               # Validation and sanitization utilities
```

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper validation and sanitization
4. Add tests for new functionality
5. Submit a pull request

## License

ISC License