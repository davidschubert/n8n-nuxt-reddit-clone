import { ID } from 'appwrite'
import { appwriteService, Query } from '~/lib/appwrite'
import type { 
  Comment, 
  CommentVote, 
  CreateCommentInput, 
  UpdateCommentInput, 
  VoteCommentInput,
  CommentWithReplies,
  CommentQueryOptions 
} from '~/types/comments'

/**
 * Comment Service
 * Handles all comment-related operations with optimized database queries
 */
export class CommentService {
  private databases = appwriteService.getDatabases()
  private databaseId = process.env.NUXT_PUBLIC_APPWRITE_DATABASE_ID || 'reddit-clone-db'
  private commentsCollection = process.env.NUXT_PUBLIC_APPWRITE_COMMENTS_COLLECTION_ID || 'comments'
  private votesCollection = process.env.NUXT_PUBLIC_APPWRITE_COMMENT_VOTES_COLLECTION_ID || 'comment-votes'

  /**
   * Create a new comment
   */
  async createComment(userId: string, input: CreateCommentInput): Promise<Comment> {
    const now = new Date()
    let depth = 0
    let path = ''
    
    // If this is a reply, calculate depth and path
    if (input.parentCommentId) {
      const parentComment = await this.getComment(input.parentCommentId)
      if (!parentComment) {
        throw new Error('Parent comment not found')
      }
      
      depth = parentComment.depth + 1
      path = `${parentComment.path}/${input.parentCommentId}`
      
      // Update parent comment's child count
      await this.databases.updateDocument(
        this.databaseId,
        this.commentsCollection,
        input.parentCommentId,
        {
          childCount: parentComment.childCount + 1,
          updatedAt: now
        }
      )
    } else {
      // Top-level comment
      path = 'root'
    }
    
    const commentId = ID.unique()
    
    const commentData = {
      content: input.content,
      authorId: userId,
      postId: input.postId,
      parentCommentId: input.parentCommentId || null,
      createdAt: now,
      updatedAt: now,
      upvotes: 0,
      downvotes: 0,
      depth,
      childCount: 0,
      isDeleted: false,
      path: path === 'root' ? commentId : `${path}`,
      score: 0
    }
    
    const result = await this.databases.createDocument(
      this.databaseId,
      this.commentsCollection,
      commentId,
      commentData
    )
    
    return this.mapDocumentToComment(result)
  }

  /**
   * Get a single comment by ID
   */
  async getComment(commentId: string): Promise<Comment | null> {
    try {
      const result = await this.databases.getDocument(
        this.databaseId,
        this.commentsCollection,
        commentId
      )
      return this.mapDocumentToComment(result)
    } catch (error) {
      if (error.code === 404) {
        return null
      }
      throw error
    }
  }

  /**
   * Get comments for a post with nested replies
   */
  async getCommentsForPost(options: CommentQueryOptions): Promise<CommentWithReplies[]> {
    const {
      postId,
      parentCommentId = null,
      limit = 20,
      offset = 0,
      sortBy = 'score',
      sortOrder = 'desc',
      maxDepth = 5
    } = options

    const queries = [
      Query.equal('postId', postId),
      Query.equal('parentCommentId', parentCommentId || 'null'),
      Query.equal('isDeleted', false),
      Query.limit(limit),
      Query.offset(offset)
    ]

    // Add sorting
    if (sortBy === 'score') {
      queries.push(Query.orderDesc('score'))
      queries.push(Query.orderDesc('createdAt')) // Secondary sort
    } else if (sortBy === 'createdAt') {
      if (sortOrder === 'desc') {
        queries.push(Query.orderDesc('createdAt'))
      } else {
        queries.push(Query.orderAsc('createdAt'))
      }
    }

    const result = await this.databases.listDocuments(
      this.databaseId,
      this.commentsCollection,
      queries
    )

    const comments = result.documents.map(doc => this.mapDocumentToComment(doc))
    
    // Load replies for each comment if within depth limit
    const commentsWithReplies: CommentWithReplies[] = []
    
    for (const comment of comments) {
      const commentWithReplies: CommentWithReplies = { ...comment, replies: [] }
      
      if (comment.childCount > 0 && comment.depth < maxDepth) {
        commentWithReplies.replies = await this.getCommentsForPost({
          postId,
          parentCommentId: comment.id,
          limit: 10, // Limit replies per comment
          sortBy,
          sortOrder,
          maxDepth
        })
      }
      
      commentsWithReplies.push(commentWithReplies)
    }
    
    return commentsWithReplies
  }

  /**
   * Update a comment (only content and editedAt)
   */
  async updateComment(commentId: string, userId: string, input: UpdateCommentInput): Promise<Comment> {
    const comment = await this.getComment(commentId)
    if (!comment) {
      throw new Error('Comment not found')
    }
    
    if (comment.authorId !== userId) {
      throw new Error('Not authorized to update this comment')
    }
    
    const now = new Date()
    
    const result = await this.databases.updateDocument(
      this.databaseId,
      this.commentsCollection,
      commentId,
      {
        content: input.content,
        editedAt: now,
        updatedAt: now
      }
    )
    
    return this.mapDocumentToComment(result)
  }

  /**
   * Soft delete a comment (preserves thread structure)
   */
  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await this.getComment(commentId)
    if (!comment) {
      throw new Error('Comment not found')
    }
    
    if (comment.authorId !== userId) {
      throw new Error('Not authorized to delete this comment')
    }
    
    await this.databases.updateDocument(
      this.databaseId,
      this.commentsCollection,
      commentId,
      {
        isDeleted: true,
        content: '[deleted]',
        updatedAt: new Date()
      }
    )
  }

  /**
   * Vote on a comment
   */
  async voteComment(userId: string, input: VoteCommentInput): Promise<void> {
    const { commentId, voteType } = input
    
    // Check if user has already voted on this comment
    const existingVotes = await this.databases.listDocuments(
      this.databaseId,
      this.votesCollection,
      [
        Query.equal('userId', userId),
        Query.equal('commentId', commentId)
      ]
    )
    
    let voteChange = 0
    
    if (existingVotes.documents.length > 0) {
      const existingVote = existingVotes.documents[0]
      
      if (existingVote.voteType === voteType) {
        // Remove vote if clicking same vote type
        await this.databases.deleteDocument(
          this.databaseId,
          this.votesCollection,
          existingVote.$id
        )
        
        voteChange = voteType === 'upvote' ? -1 : 1
      } else {
        // Change vote type
        await this.databases.updateDocument(
          this.databaseId,
          this.votesCollection,
          existingVote.$id,
          {
            voteType,
            createdAt: new Date()
          }
        )
        
        voteChange = voteType === 'upvote' ? 2 : -2
      }
    } else {
      // Create new vote
      await this.databases.createDocument(
        this.databaseId,
        this.votesCollection,
        ID.unique(),
        {
          userId,
          commentId,
          voteType,
          createdAt: new Date()
        }
      )
      
      voteChange = voteType === 'upvote' ? 1 : -1
    }
    
    // Update comment vote counts and score
    const comment = await this.getComment(commentId)
    if (comment) {
      const newUpvotes = voteType === 'upvote' && voteChange > 0 
        ? comment.upvotes + Math.abs(voteChange)
        : voteType === 'upvote' && voteChange < 0
        ? comment.upvotes - Math.abs(voteChange)
        : comment.upvotes
        
      const newDownvotes = voteType === 'downvote' && voteChange < 0
        ? comment.downvotes + Math.abs(voteChange)
        : voteType === 'downvote' && voteChange > 0
        ? comment.downvotes - Math.abs(voteChange)
        : comment.downvotes
      
      await this.databases.updateDocument(
        this.databaseId,
        this.commentsCollection,
        commentId,
        {
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          score: newUpvotes - newDownvotes,
          updatedAt: new Date()
        }
      )
    }
  }

  /**
   * Get user's vote for a comment
   */
  async getUserVote(userId: string, commentId: string): Promise<CommentVote | null> {
    const result = await this.databases.listDocuments(
      this.databaseId,
      this.votesCollection,
      [
        Query.equal('userId', userId),
        Query.equal('commentId', commentId)
      ]
    )
    
    if (result.documents.length > 0) {
      return this.mapDocumentToVote(result.documents[0])
    }
    
    return null
  }

  /**
   * Get comments by user
   */
  async getCommentsByUser(userId: string, limit = 20, offset = 0): Promise<Comment[]> {
    const result = await this.databases.listDocuments(
      this.databaseId,
      this.commentsCollection,
      [
        Query.equal('authorId', userId),
        Query.equal('isDeleted', false),
        Query.orderDesc('createdAt'),
        Query.limit(limit),
        Query.offset(offset)
      ]
    )
    
    return result.documents.map(doc => this.mapDocumentToComment(doc))
  }

  /**
   * Map Appwrite document to Comment interface
   */
  private mapDocumentToComment(doc: any): Comment {
    return {
      id: doc.$id,
      content: doc.content,
      authorId: doc.authorId,
      postId: doc.postId,
      parentCommentId: doc.parentCommentId === 'null' ? null : doc.parentCommentId,
      createdAt: new Date(doc.createdAt),
      updatedAt: new Date(doc.updatedAt),
      upvotes: doc.upvotes,
      downvotes: doc.downvotes,
      depth: doc.depth,
      childCount: doc.childCount,
      isDeleted: doc.isDeleted,
      editedAt: doc.editedAt ? new Date(doc.editedAt) : undefined,
      path: doc.path,
      score: doc.score
    }
  }

  /**
   * Map Appwrite document to CommentVote interface
   */
  private mapDocumentToVote(doc: any): CommentVote {
    return {
      id: doc.$id,
      commentId: doc.commentId,
      userId: doc.userId,
      voteType: doc.voteType,
      createdAt: new Date(doc.createdAt)
    }
  }
}

// Export singleton instance
export const commentService = new CommentService()