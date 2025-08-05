/**
 * TypeScript interfaces for the Comment system database schema
 * Implements self-referencing structure for nested comments with performance optimizations
 */

export interface Comment {
  /** Unique identifier for the comment */
  id: string
  
  /** The actual comment content (markdown supported) */
  content: string
  
  /** ID of the user who created this comment */
  authorId: string
  
  /** ID of the post this comment belongs to */
  postId: string
  
  /** ID of the parent comment (null for top-level comments) */
  parentCommentId: string | null
  
  /** When the comment was created */
  createdAt: Date
  
  /** When the comment was last updated */
  updatedAt: Date
  
  /** Number of upvotes */
  upvotes: number
  
  /** Number of downvotes */
  downvotes: number
  
  /** Depth level in the comment tree (0 for top-level) - for performance optimization */
  depth: number
  
  /** Number of direct and indirect child comments - cached for performance */
  childCount: number
  
  /** Soft delete flag - allows preserving thread structure */
  isDeleted: boolean
  
  /** When the comment was edited (if applicable) */
  editedAt?: Date
  
  /** Materialized path for efficient tree queries (e.g., "1/5/12") */
  path: string
  
  /** Computed score (upvotes - downvotes) for sorting */
  score: number
}

export interface CommentVote {
  /** Unique identifier for the vote */
  id: string
  
  /** ID of the comment being voted on */
  commentId: string
  
  /** ID of the user casting the vote */
  userId: string
  
  /** Type of vote */
  voteType: 'upvote' | 'downvote'
  
  /** When the vote was cast */
  createdAt: Date
}

/**
 * Input type for creating a new comment
 */
export interface CreateCommentInput {
  content: string
  postId: string
  parentCommentId?: string | null
}

/**
 * Input type for updating an existing comment
 */
export interface UpdateCommentInput {
  content: string
}

/**
 * Input type for voting on a comment
 */
export interface VoteCommentInput {
  commentId: string
  voteType: 'upvote' | 'downvote'
}

/**
 * Response type for comment queries with nested structure
 */
export interface CommentWithReplies extends Comment {
  replies?: CommentWithReplies[]
  userVote?: CommentVote
  author?: {
    id: string
    username: string
    avatar?: string
  }
}

/**
 * Options for querying comments
 */
export interface CommentQueryOptions {
  postId: string
  parentCommentId?: string | null
  limit?: number
  offset?: number
  sortBy?: 'score' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
  maxDepth?: number
}