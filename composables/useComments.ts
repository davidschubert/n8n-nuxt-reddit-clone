import type { Comment, CommentQueryParams } from '~/types'

interface UseCommentsOptions extends Partial<CommentQueryParams> {
  server?: boolean
  lazy?: boolean
  immediate?: boolean
}

export const useComments = (postId: string, options: UseCommentsOptions = {}) => {
  const {
    limit = 50,
    depth = 3,
    server = true,
    lazy = false,
    immediate = true
  } = options

  // Use $fetch with SSR support
  const { data: commentsData, pending, error, refresh } = useLazyFetch(
    `/api/comments/${postId}`,
    {
      key: `comments-${postId}`,
      query: {
        limit,
        depth
      },
      server,
      lazy,
      immediate,
      transform: (response: any) => response.data?.comments || [],
      onResponseError({ response }) {
        console.error('Comments fetch error:', response._data)
      }
    }
  )

  const comments = computed(() => commentsData.value || [])
  const loading = computed(() => pending.value)
  const hasError = computed(() => !!error.value)

  // Refresh comments with cache invalidation
  const refreshComments = async () => {
    await refresh()
  }

  // Load more comments (pagination)
  const loadMore = async (offset: number = 0) => {
    try {
      const { data } = await $fetch<any>(`/api/comments/${postId}`, {
        query: {
          limit,
          depth,
          offset
        }
      })
      
      if (data?.comments) {
        // Append new comments to existing ones
        const existingComments = commentsData.value || []
        commentsData.value = [...existingComments, ...data.comments]
      }
      
      return data?.comments || []
    } catch (err) {
      console.error('Error loading more comments:', err)
      throw err
    }
  }

  return {
    comments: readonly(comments),
    loading: readonly(loading),
    error: readonly(error),
    hasError: readonly(hasError),
    refresh: refreshComments,
    loadMore
  }
}

// Specialized composable for SSR with caching
export const useSSRComments = (postId: string, options: UseCommentsOptions = {}) => {
  const config = useRuntimeConfig()
  
  return useComments(postId, {
    ...options,
    server: true,
    lazy: false,
    immediate: true
  })
}

// Client-side only composable
export const useClientComments = (postId: string, options: UseCommentsOptions = {}) => {
  return useComments(postId, {
    ...options,
    server: false,
    lazy: true
  })
}

// Composable for individual comment threads
export const useCommentThread = (commentId: string) => {
  const { data: threadData, pending, error, refresh } = useLazyFetch(
    `/api/comments/${commentId}/replies`,
    {
      key: `comment-thread-${commentId}`,
      server: false, // Usually loaded on demand
      lazy: true,
      transform: (response: any) => response.data || []
    }
  )

  return {
    replies: readonly(threadData),
    loading: readonly(pending),
    error: readonly(error),
    refresh
  }
}