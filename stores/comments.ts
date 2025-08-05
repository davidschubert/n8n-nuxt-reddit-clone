import { defineStore } from 'pinia'
import type { Comment, CommentsResponse, CommentQueryParams } from '~/types'
import { useAppwrite } from '~/utils/appwrite'

interface CommentsState {
  comments: Record<string, Comment[]> // postId -> comments
  loading: boolean
  error: string | null
  cache: Record<string, { data: Comment[], timestamp: number }> // Simple caching
}

export const useCommentsStore = defineStore('comments', {
  state: (): CommentsState => ({
    comments: {},
    loading: false,
    error: null,
    cache: {}
  }),

  getters: {
    getCommentsByPostId: (state) => (postId: string) => {
      return state.comments[postId] || []
    },

    isLoading: (state) => state.loading,

    hasError: (state) => !!state.error,

    getCachedComments: (state) => (postId: string) => {
      const cached = state.cache[postId]
      if (!cached) return null
      
      // Cache is valid for 5 minutes
      const isValid = Date.now() - cached.timestamp < 5 * 60 * 1000
      return isValid ? cached.data : null
    }
  },

  actions: {
    async fetchComments(params: CommentQueryParams, useCache = true) {
      const { postId } = params
      
      // Check cache first
      if (useCache) {
        const cached = this.getCachedComments(postId)
        if (cached) {
          this.comments[postId] = cached
          return cached
        }
      }

      this.loading = true
      this.error = null

      try {
        const appwrite = useAppwrite()
        const response: CommentsResponse = await appwrite.getCommentsWithReplies(params)
        
        this.comments[postId] = response.comments
        
        // Update cache
        this.cache[postId] = {
          data: response.comments,
          timestamp: Date.now()
        }

        return response.comments
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch comments'
        console.error('Error fetching comments:', error)
        return []
      } finally {
        this.loading = false
      }
    },

    async loadMoreReplies(commentId: string, limit = 20, offset = 0) {
      try {
        const appwrite = useAppwrite()
        return await appwrite.getCommentReplies(commentId, limit, offset)
      } catch (error: any) {
        this.error = error.message || 'Failed to load more replies'
        console.error('Error loading more replies:', error)
        return []
      }
    },

    async addComment(data: { content: string; postId: string; parentId?: string; authorId: string }) {
      this.loading = true
      this.error = null

      try {
        const appwrite = useAppwrite()
        const newComment = await appwrite.createComment(data)
        
        // Add comment to local state
        if (!this.comments[data.postId]) {
          this.comments[data.postId] = []
        }

        if (data.parentId) {
          // Add as reply to parent comment
          this.addReplyToComment(data.postId, data.parentId, newComment)
        } else {
          // Add as top-level comment
          this.comments[data.postId].unshift(newComment)
        }

        // Invalidate cache
        delete this.cache[data.postId]

        return newComment
      } catch (error: any) {
        this.error = error.message || 'Failed to add comment'
        console.error('Error adding comment:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    addReplyToComment(postId: string, parentId: string, reply: Comment) {
      const comments = this.comments[postId]
      if (!comments) return

      const addReplyRecursive = (commentList: Comment[]): boolean => {
        for (const comment of commentList) {
          if (comment.$id === parentId) {
            if (!comment.replies) comment.replies = []
            comment.replies.push(reply)
            comment.replyCount = (comment.replyCount || 0) + 1
            return true
          }
          if (comment.replies && addReplyRecursive(comment.replies)) {
            return true
          }
        }
        return false
      }

      addReplyRecursive(comments)
    },

    clearError() {
      this.error = null
    },

    clearCache(postId?: string) {
      if (postId) {
        delete this.cache[postId]
      } else {
        this.cache = {}
      }
    },

    // Optimistic update for better UX
    addOptimisticComment(comment: Partial<Comment> & { content: string; postId: string }) {
      const optimisticComment: Comment = {
        $id: `temp-${Date.now()}`,
        $collectionId: '',
        $databaseId: '',
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
        $permissions: [],
        content: comment.content,
        authorId: comment.authorId || 'current-user',
        postId: comment.postId,
        parentId: comment.parentId,
        upvotes: 0,
        downvotes: 0,
        depth: comment.depth || 0,
        replyCount: 0,
        replies: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...comment
      } as Comment

      if (!this.comments[comment.postId]) {
        this.comments[comment.postId] = []
      }

      if (comment.parentId) {
        this.addReplyToComment(comment.postId, comment.parentId, optimisticComment)
      } else {
        this.comments[comment.postId].unshift(optimisticComment)
      }

      return optimisticComment
    }
  }
})