import { Client, Databases, Account, Query } from 'appwrite'
import type { CommentQueryParams, Comment, CommentsResponse } from '~/types'
import { mockComments } from '~/mock/data'

class AppwriteService {
  private client: Client
  private databases: Databases
  private account: Account
  private config: any
  private isDevelopment: boolean

  constructor() {
    this.config = useRuntimeConfig()
    this.isDevelopment = process.dev || !this.config.public.appwriteProjectId
    
    if (!this.isDevelopment) {
      this.client = new Client()
      this.client
        .setEndpoint(this.config.public.appwriteEndpoint)
        .setProject(this.config.public.appwriteProjectId)

      this.databases = new Databases(this.client)
      this.account = new Account(this.client)
    }
  }

  // Get comments with replies for SSR
  async getCommentsWithReplies(params: CommentQueryParams): Promise<CommentsResponse> {
    // Use mock data in development
    if (this.isDevelopment) {
      return this.getMockComments(params)
    }

    try {
      const { postId, limit = 50, offset = 0, depth = 3 } = params

      // First, get top-level comments
      const topLevelComments = await this.databases.listDocuments(
        this.config.public.appwriteDatabaseId,
        this.config.public.appwriteCommentsCollectionId,
        [
          Query.equal('postId', postId),
          Query.isNull('parentId'),
          Query.orderDesc('createdAt'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      )

      // Build nested comment structure
      const commentsWithReplies = await Promise.all(
        topLevelComments.documents.map(async (comment) => {
          return await this.buildCommentTree(comment as Comment, depth - 1)
        })
      )

      return {
        comments: commentsWithReplies,
        total: topLevelComments.total,
        hasMore: topLevelComments.total > offset + limit
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
      throw error
    }
  }

  // Mock data for development
  private getMockComments(params: CommentQueryParams): CommentsResponse {
    const { postId, limit = 50, offset = 0 } = params
    const comments = mockComments[postId] || []
    const paginatedComments = comments.slice(offset, offset + limit)
    
    return {
      comments: paginatedComments,
      total: comments.length,
      hasMore: comments.length > offset + limit
    }
  }

  // Recursively build comment tree
  private async buildCommentTree(comment: Comment, remainingDepth: number): Promise<Comment> {
    if (remainingDepth <= 0) {
      return { ...comment, replies: [] }
    }

    try {
      const replies = await this.databases.listDocuments(
        this.config.public.appwriteDatabaseId,
        this.config.public.appwriteCommentsCollectionId,
        [
          Query.equal('parentId', comment.$id),
          Query.orderAsc('createdAt'),
          Query.limit(20) // Limit replies per comment for performance
        ]
      )

      const nestedReplies = await Promise.all(
        replies.documents.map(async (reply) => {
          return await this.buildCommentTree(reply as Comment, remainingDepth - 1)
        })
      )

      return {
        ...comment,
        replies: nestedReplies
      }
    } catch (error) {
      console.error('Error building comment tree:', error)
      return { ...comment, replies: [] }
    }
  }

  // Get additional replies for lazy loading
  async getCommentReplies(commentId: string, limit = 20, offset = 0): Promise<Comment[]> {
    // Use mock data in development
    if (this.isDevelopment) {
      // For simplicity, return empty array in mock mode
      return []
    }

    try {
      const replies = await this.databases.listDocuments(
        this.config.public.appwriteDatabaseId,
        this.config.public.appwriteCommentsCollectionId,
        [
          Query.equal('parentId', commentId),
          Query.orderAsc('createdAt'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      )

      return replies.documents as Comment[]
    } catch (error) {
      console.error('Error fetching comment replies:', error)
      throw error
    }
  }

  // Create a new comment
  async createComment(data: { content: string; postId: string; parentId?: string; authorId: string }): Promise<Comment> {
    // Use mock data in development
    if (this.isDevelopment) {
      return this.createMockComment(data)
    }

    try {
      const comment = await this.databases.createDocument(
        this.config.public.appwriteDatabaseId,
        this.config.public.appwriteCommentsCollectionId,
        'unique()',
        {
          content: data.content,
          postId: data.postId,
          parentId: data.parentId || null,
          authorId: data.authorId,
          upvotes: 0,
          downvotes: 0,
          depth: data.parentId ? await this.calculateCommentDepth(data.parentId) + 1 : 0,
          replyCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      )

      return comment as Comment
    } catch (error) {
      console.error('Error creating comment:', error)
      throw error
    }
  }

  // Mock comment creation
  private createMockComment(data: { content: string; postId: string; parentId?: string; authorId: string }): Comment {
    return {
      $id: `mock-${Date.now()}`,
      $collectionId: 'comments',
      $databaseId: 'db1',
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      content: data.content,
      authorId: data.authorId,
      postId: data.postId,
      parentId: data.parentId,
      upvotes: 0,
      downvotes: 0,
      depth: data.parentId ? 1 : 0,
      replyCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: []
    }
  }

  // Calculate comment depth
  private async calculateCommentDepth(parentId: string): Promise<number> {
    try {
      const parent = await this.databases.getDocument(
        this.config.public.appwriteDatabaseId,
        this.config.public.appwriteCommentsCollectionId,
        parentId
      )

      return (parent as Comment).depth || 0
    } catch (error) {
      console.error('Error calculating comment depth:', error)
      return 0
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      return await this.account.get()
    } catch (error) {
      return null
    }
  }
}

// Singleton instance
let appwriteService: AppwriteService | null = null

export const useAppwrite = () => {
  if (!appwriteService) {
    appwriteService = new AppwriteService()
  }
  return appwriteService
}

export default AppwriteService