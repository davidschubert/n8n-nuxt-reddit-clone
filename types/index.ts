// Base interface for Appwrite documents
export interface AppwriteDocument {
  $id: string
  $collectionId: string
  $databaseId: string
  $createdAt: string
  $updatedAt: string
  $permissions: string[]
}

// User interface
export interface User extends AppwriteDocument {
  username: string
  email: string
  avatar?: string
}

// Post interface
export interface Post extends AppwriteDocument {
  title: string
  content: string
  authorId: string
  author?: User
  upvotes: number
  downvotes: number
  commentCount: number
  createdAt: string
  updatedAt: string
}

// Comment interface with nested structure
export interface Comment extends AppwriteDocument {
  content: string
  authorId: string
  author?: User
  postId: string
  parentId?: string
  upvotes: number
  downvotes: number
  depth: number
  replyCount: number
  replies?: Comment[]
  createdAt: string
  updatedAt: string
}

// API Response interfaces
export interface CommentsResponse {
  comments: Comment[]
  total: number
  hasMore: boolean
  nextCursor?: string
}

export interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[]
}

// Query parameters for comments
export interface CommentQueryParams {
  postId: string
  limit?: number
  offset?: number
  depth?: number
  parentId?: string
  cursor?: string
}

// Comment creation/update interfaces
export interface CreateCommentData {
  content: string
  postId: string
  parentId?: string
}

export interface UpdateCommentData {
  content: string
}

// Vote interfaces
export interface VoteData {
  type: 'up' | 'down'
  targetId: string
  targetType: 'post' | 'comment'
}

// Error interface
export interface ApiError {
  message: string
  code: string
  type: string
}