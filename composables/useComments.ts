import type { Comment, CreateCommentPayload, UpdateCommentPayload, ApiResponse } from '~/types'

/**
 * Composable for managing comments API calls and state
 */
export const useComments = () => {
  const comments = ref<Comment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch comments for a post
   */
  const fetchComments = async (postId: string): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<Comment[]>>(`/api/comments?postId=${postId}`)
      
      if (response.success) {
        comments.value = response.data
      } else {
        throw new Error(response.error || 'Failed to fetch comments')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch comments'
      console.error('Error fetching comments:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new comment
   */
  const createComment = async (payload: CreateCommentPayload): Promise<Comment | null> => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<Comment>>('/api/comments', {
        method: 'POST',
        body: payload
      })

      if (response.success) {
        // Add the new comment to the local state
        const newComment = response.data
        
        if (payload.parentCommentId) {
          // Add as a reply to an existing comment
          addReplyToComment(payload.parentCommentId, newComment)
        } else {
          // Add as a top-level comment
          comments.value.unshift(newComment)
        }
        
        return newComment
      } else {
        throw new Error(response.error || 'Failed to create comment')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create comment'
      console.error('Error creating comment:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Update an existing comment
   */
  const updateComment = async (commentId: string, payload: UpdateCommentPayload): Promise<Comment | null> => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<Comment>>(`/api/comments/${commentId}`, {
        method: 'PUT',
        body: payload
      })

      if (response.success) {
        // Update the comment in local state
        updateCommentInState(commentId, response.data)
        return response.data
      } else {
        throw new Error(response.error || 'Failed to update comment')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update comment'
      console.error('Error updating comment:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete a comment
   */
  const deleteComment = async (commentId: string): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<void>>(`/api/comments/${commentId}`, {
        method: 'DELETE'
      })

      if (response.success) {
        // Remove the comment from local state
        removeCommentFromState(commentId)
        return true
      } else {
        throw new Error(response.error || 'Failed to delete comment')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete comment'
      console.error('Error deleting comment:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Add a reply to an existing comment in the state
   */
  const addReplyToComment = (parentCommentId: string, reply: Comment) => {
    const addToComments = (commentList: Comment[]): boolean => {
      for (const comment of commentList) {
        if (comment.id === parentCommentId) {
          if (!comment.replies) {
            comment.replies = []
          }
          comment.replies.unshift(reply)
          return true
        }
        if (comment.replies && addToComments(comment.replies)) {
          return true
        }
      }
      return false
    }

    addToComments(comments.value)
  }

  /**
   * Update a comment in the state
   */
  const updateCommentInState = (commentId: string, updatedComment: Comment) => {
    const updateInComments = (commentList: Comment[]): boolean => {
      for (let i = 0; i < commentList.length; i++) {
        if (commentList[i].id === commentId) {
          commentList[i] = { ...commentList[i], ...updatedComment }
          return true
        }
        if (commentList[i].replies && updateInComments(commentList[i].replies!)) {
          return true
        }
      }
      return false
    }

    updateInComments(comments.value)
  }

  /**
   * Remove a comment from the state
   */
  const removeCommentFromState = (commentId: string) => {
    const removeFromComments = (commentList: Comment[]): boolean => {
      for (let i = 0; i < commentList.length; i++) {
        if (commentList[i].id === commentId) {
          commentList.splice(i, 1)
          return true
        }
        if (commentList[i].replies && removeFromComments(commentList[i].replies!)) {
          return true
        }
      }
      return false
    }

    removeFromComments(comments.value)
  }

  /**
   * Clear all comments and state
   */
  const clearComments = () => {
    comments.value = []
    error.value = null
  }

  return {
    comments: readonly(comments),
    loading: readonly(loading),
    error: readonly(error),
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
    clearComments
  }
}