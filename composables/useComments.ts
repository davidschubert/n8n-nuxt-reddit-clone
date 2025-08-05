import { RealtimeResponseEvent } from 'appwrite'

export interface Comment {
  $id: string
  postId: string
  userId: string
  content: string
  parentId?: string
  votes: number
  userVote?: 'up' | 'down' | null
  createdAt: string
  updatedAt: string
  author?: {
    username: string
    avatar?: string
  }
  replies?: Comment[]
}

export interface CommentVote {
  $id: string
  commentId: string
  userId: string
  type: 'up' | 'down'
  createdAt: string
}

export const useComments = (postId: string) => {
  const { databases, subscribe, unsubscribe, queueOfflineAction, connectionState } = useAppwrite()
  const config = useRuntimeConfig()

  // Local state
  const comments = ref<Comment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Subscription tracking
  let commentsSubscriptionId: string | null = null
  let votesSubscriptionId: string | null = null

  // Debounced update handling for performance
  const pendingUpdates = ref<Set<string>>(new Set())
  const updateBatch = ref<Comment[]>([])
  
  let updateTimer: NodeJS.Timeout | null = null

  // Process batched updates
  const processBatchedUpdates = () => {
    if (updateBatch.value.length === 0) return

    const updatedComments = [...comments.value]
    
    updateBatch.value.forEach(updatedComment => {
      const index = updatedComments.findIndex(c => c.$id === updatedComment.$id)
      if (index !== -1) {
        updatedComments[index] = updatedComment
      } else {
        // New comment - add to appropriate position
        if (updatedComment.parentId) {
          // Find parent comment and add as reply
          const parentIndex = updatedComments.findIndex(c => c.$id === updatedComment.parentId)
          if (parentIndex !== -1) {
            if (!updatedComments[parentIndex].replies) {
              updatedComments[parentIndex].replies = []
            }
            updatedComments[parentIndex].replies!.push(updatedComment)
          }
        } else {
          // Top-level comment
          updatedComments.unshift(updatedComment)
        }
      }
    })

    comments.value = updatedComments
    updateBatch.value = []
    pendingUpdates.value.clear()
  }

  // Handle comment updates with debouncing
  const handleCommentUpdate = (comment: Comment) => {
    if (pendingUpdates.value.has(comment.$id)) return

    pendingUpdates.value.add(comment.$id)
    updateBatch.value.push(comment)

    if (updateTimer) {
      clearTimeout(updateTimer)
    }

    updateTimer = setTimeout(processBatchedUpdates, 100) // 100ms debounce
  }

  // Handle comment deletion
  const handleCommentDelete = (commentId: string) => {
    comments.value = comments.value.filter(comment => {
      if (comment.$id === commentId) {
        return false
      }
      if (comment.replies) {
        comment.replies = comment.replies.filter(reply => reply.$id !== commentId)
      }
      return true
    })
  }

  // Handle vote updates
  const handleVoteUpdate = (vote: CommentVote) => {
    const commentId = vote.commentId
    
    // Update the comment's vote count and user vote status
    const updateCommentVotes = (commentList: Comment[]) => {
      commentList.forEach(comment => {
        if (comment.$id === commentId) {
          // This is a simplified vote update - in a real app you'd need to
          // track all votes to calculate the total properly
          comment.userVote = vote.type
        }
        if (comment.replies) {
          updateCommentVotes(comment.replies)
        }
      })
    }

    updateCommentVotes(comments.value)
  }

  // Subscribe to comment changes for this post
  const subscribeToComments = () => {
    if (commentsSubscriptionId) return

    const channels = [
      `databases.${config.public.appwrite.databaseId}.collections.${config.public.appwrite.commentsCollectionId}.documents`
    ]

    commentsSubscriptionId = subscribe(channels, (response: RealtimeResponseEvent<Comment>) => {
      const { events, payload } = response

      // Filter for comments related to this post
      if (!payload || payload.postId !== postId) return

      if (events.includes('databases.*.collections.*.documents.*.create')) {
        handleCommentUpdate(payload)
      } else if (events.includes('databases.*.collections.*.documents.*.update')) {
        handleCommentUpdate(payload)
      } else if (events.includes('databases.*.collections.*.documents.*.delete')) {
        handleCommentDelete(payload.$id)
      }
    })
  }

  // Subscribe to vote changes for comments in this post
  const subscribeToVotes = () => {
    if (votesSubscriptionId) return

    const channels = [
      `databases.${config.public.appwrite.databaseId}.collections.${config.public.appwrite.votesCollectionId}.documents`
    ]

    votesSubscriptionId = subscribe(channels, (response: RealtimeResponseEvent<CommentVote>) => {
      const { events, payload } = response

      if (!payload) return

      if (events.includes('databases.*.collections.*.documents.*.create') ||
          events.includes('databases.*.collections.*.documents.*.update')) {
        handleVoteUpdate(payload)
      }
    })
  }

  // Load initial comments
  const loadComments = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await databases.listDocuments(
        config.public.appwrite.databaseId,
        config.public.appwrite.commentsCollectionId,
        [
          `postId=${postId}`,
          'orderBy=createdAt',
          'orderType=DESC'
        ]
      )

      // Group comments by parent/child relationship
      const commentMap = new Map<string, Comment>()
      const topLevelComments: Comment[] = []

      response.documents.forEach((doc: any) => {
        const comment: Comment = {
          $id: doc.$id,
          postId: doc.postId,
          userId: doc.userId,
          content: doc.content,
          parentId: doc.parentId,
          votes: doc.votes || 0,
          createdAt: doc.$createdAt,
          updatedAt: doc.$updatedAt,
          replies: []
        }
        commentMap.set(comment.$id, comment)
      })

      // Build comment tree
      commentMap.forEach(comment => {
        if (comment.parentId) {
          const parent = commentMap.get(comment.parentId)
          if (parent) {
            parent.replies!.push(comment)
          }
        } else {
          topLevelComments.push(comment)
        }
      })

      comments.value = topLevelComments
    } catch (err) {
      error.value = 'Failed to load comments'
      console.error('Error loading comments:', err)
    } finally {
      loading.value = false
    }
  }

  // Add a new comment
  const addComment = async (content: string, parentId?: string) => {
    if (!connectionState.value.isConnected) {
      queueOfflineAction('addComment', { content, parentId, postId })
      return
    }

    try {
      await databases.createDocument(
        config.public.appwrite.databaseId,
        config.public.appwrite.commentsCollectionId,
        'unique()',
        {
          postId,
          content,
          parentId,
          votes: 0,
          userId: 'current-user-id' // This would come from auth
        }
      )
    } catch (err) {
      error.value = 'Failed to add comment'
      console.error('Error adding comment:', err)
    }
  }

  // Vote on a comment
  const voteComment = async (commentId: string, voteType: 'up' | 'down') => {
    if (!connectionState.value.isConnected) {
      queueOfflineAction('voteComment', { commentId, voteType })
      return
    }

    try {
      await databases.createDocument(
        config.public.appwrite.databaseId,
        config.public.appwrite.votesCollectionId,
        'unique()',
        {
          commentId,
          type: voteType,
          userId: 'current-user-id' // This would come from auth
        }
      )
    } catch (err) {
      error.value = 'Failed to vote on comment'
      console.error('Error voting on comment:', err)
    }
  }

  // Start realtime subscriptions
  const startRealtime = () => {
    subscribeToComments()
    subscribeToVotes()
  }

  // Stop realtime subscriptions
  const stopRealtime = () => {
    if (commentsSubscriptionId) {
      unsubscribe(commentsSubscriptionId)
      commentsSubscriptionId = null
    }
    if (votesSubscriptionId) {
      unsubscribe(votesSubscriptionId)
      votesSubscriptionId = null
    }
    if (updateTimer) {
      clearTimeout(updateTimer)
      updateTimer = null
    }
  }

  // Initialize
  onMounted(() => {
    loadComments()
    startRealtime()
  })

  // Cleanup
  onUnmounted(() => {
    stopRealtime()
  })

  return {
    comments: readonly(comments),
    loading: readonly(loading),
    error: readonly(error),
    addComment,
    voteComment,
    loadComments,
    startRealtime,
    stopRealtime
  }
}