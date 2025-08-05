/**
 * Database collection configurations for Appwrite
 * Defines the structure, attributes, and indexes for all collections
 */

export interface CollectionConfig {
  id: string
  name: string
  permissions: string[]
  attributes: AttributeConfig[]
  indexes: IndexConfig[]
}

export interface AttributeConfig {
  key: string
  type: 'string' | 'integer' | 'float' | 'boolean' | 'datetime' | 'email' | 'ip' | 'url'
  size?: number
  required: boolean
  array?: boolean
  default?: any
}

export interface IndexConfig {
  key: string
  type: 'key' | 'fulltext' | 'unique'
  attributes: string[]
  orders?: ('ASC' | 'DESC')[]
}

/**
 * Comments Collection Configuration
 * Self-referencing structure for nested comments with performance optimizations
 */
export const commentsCollectionConfig: CollectionConfig = {
  id: 'comments',
  name: 'Comments',
  permissions: [
    'read("any")',  // Anyone can read comments
    'create("users")',  // Only authenticated users can create
    'update("users")',  // Only authenticated users can update (will be restricted to authors in security rules)
    'delete("users")'   // Only authenticated users can delete (will be restricted to authors in security rules)
  ],
  attributes: [
    {
      key: 'content',
      type: 'string',
      size: 10000,  // Allow up to 10k characters for comments
      required: true
    },
    {
      key: 'authorId',
      type: 'string',
      size: 36,  // UUID length
      required: true
    },
    {
      key: 'postId',
      type: 'string',
      size: 36,  // UUID length
      required: true
    },
    {
      key: 'parentCommentId',
      type: 'string',
      size: 36,  // UUID length
      required: false  // null for top-level comments
    },
    {
      key: 'createdAt',
      type: 'datetime',
      required: true
    },
    {
      key: 'updatedAt',
      type: 'datetime',
      required: true
    },
    {
      key: 'upvotes',
      type: 'integer',
      required: true,
      default: 0
    },
    {
      key: 'downvotes',
      type: 'integer',
      required: true,
      default: 0
    },
    {
      key: 'depth',
      type: 'integer',
      required: true,
      default: 0
    },
    {
      key: 'childCount',
      type: 'integer',
      required: true,
      default: 0
    },
    {
      key: 'isDeleted',
      type: 'boolean',
      required: true,
      default: false
    },
    {
      key: 'editedAt',
      type: 'datetime',
      required: false
    },
    {
      key: 'path',
      type: 'string',
      size: 1000,  // Materialized path for tree queries
      required: true
    },
    {
      key: 'score',
      type: 'integer',
      required: true,
      default: 0  // upvotes - downvotes
    }
  ],
  indexes: [
    // Primary queries
    {
      key: 'postId_parentCommentId',
      type: 'key',
      attributes: ['postId', 'parentCommentId']
    },
    {
      key: 'postId_score_createdAt',
      type: 'key',
      attributes: ['postId', 'score', 'createdAt'],
      orders: ['ASC', 'DESC', 'DESC']
    },
    {
      key: 'authorId_createdAt',
      type: 'key',
      attributes: ['authorId', 'createdAt'],
      orders: ['ASC', 'DESC']
    },
    // Tree structure queries
    {
      key: 'path',
      type: 'key',
      attributes: ['path']
    },
    {
      key: 'parentCommentId_score',
      type: 'key',
      attributes: ['parentCommentId', 'score'],
      orders: ['ASC', 'DESC']
    },
    // Performance indexes
    {
      key: 'postId_depth_score',
      type: 'key',
      attributes: ['postId', 'depth', 'score'],
      orders: ['ASC', 'ASC', 'DESC']
    },
    {
      key: 'isDeleted_postId',
      type: 'key',
      attributes: ['isDeleted', 'postId']
    },
    // Full text search on content
    {
      key: 'content_fulltext',
      type: 'fulltext',
      attributes: ['content']
    }
  ]
}

/**
 * Comment Votes Collection Configuration
 * Separate collection for voting to prevent vote manipulation and enable analytics
 */
export const commentVotesCollectionConfig: CollectionConfig = {
  id: 'comment-votes',
  name: 'Comment Votes',
  permissions: [
    'read("users")',    // Only authenticated users can read votes
    'create("users")',  // Only authenticated users can vote
    'update("users")',  // Users can change their vote
    'delete("users")'   // Users can remove their vote
  ],
  attributes: [
    {
      key: 'commentId',
      type: 'string',
      size: 36,  // UUID length
      required: true
    },
    {
      key: 'userId',
      type: 'string',
      size: 36,  // UUID length
      required: true
    },
    {
      key: 'voteType',
      type: 'string',
      size: 20,  // 'upvote' or 'downvote'
      required: true
    },
    {
      key: 'createdAt',
      type: 'datetime',
      required: true
    }
  ],
  indexes: [
    // Ensure one vote per user per comment
    {
      key: 'userId_commentId_unique',
      type: 'unique',
      attributes: ['userId', 'commentId']
    },
    // Query votes for a comment
    {
      key: 'commentId_voteType',
      type: 'key',
      attributes: ['commentId', 'voteType']
    },
    // Query votes by user
    {
      key: 'userId_createdAt',
      type: 'key',
      attributes: ['userId', 'createdAt'],
      orders: ['ASC', 'DESC']
    },
    // Analytics queries
    {
      key: 'voteType_createdAt',
      type: 'key',
      attributes: ['voteType', 'createdAt'],
      orders: ['ASC', 'DESC']
    }
  ]
}

// Export all collection configurations
export const allCollectionConfigs = [
  commentsCollectionConfig,
  commentVotesCollectionConfig
]