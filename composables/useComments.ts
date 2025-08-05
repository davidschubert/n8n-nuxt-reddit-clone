import type { Comment, CommentCreate, Vote, CommentSort } from '~/types/comment'

export const useComments = () => {
  const { $appwrite } = useNuxtApp()
  const config = useRuntimeConfig()

  const comments = ref<Comment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentSort = ref<CommentSort>({
    field: 'score',
    direction: 'desc',
    label: 'Beliebt'
  })

  const buildCommentTree = (flatComments: Comment[]): Comment[] => {
    const commentMap = new Map<string, Comment>()
    const rootComments: Comment[] = []

    // First pass: create map and initialize replies array
    flatComments.forEach(comment => {
      comment.replies = []
      commentMap.set(comment.$id, comment)
    })

    // Second pass: build tree structure
    flatComments.forEach(comment => {
      if (comment.parentId && commentMap.has(comment.parentId)) {
        const parent = commentMap.get(comment.parentId)!
        parent.replies!.push(comment)
        parent.childCount = parent.replies!.length
      } else {
        rootComments.push(comment)
      }
    })

    // Sort replies recursively
    const sortComments = (comments: Comment[]): Comment[] => {
      return comments
        .sort((a, b) => {
          if (currentSort.value.field === 'score') {
            return currentSort.value.direction === 'desc' 
              ? b.score - a.score 
              : a.score - b.score
          } else if (currentSort.value.field === 'createdAt') {
            const aTime = new Date(a.$createdAt).getTime()
            const bTime = new Date(b.$createdAt).getTime()
            return currentSort.value.direction === 'desc' 
              ? bTime - aTime 
              : aTime - bTime
          }
          return 0
        })
        .map(comment => ({
          ...comment,
          replies: comment.replies ? sortComments(comment.replies) : []
        }))
    }

    return sortComments(rootComments)
  }

  const fetchComments = async (postId: string) => {
    try {
      loading.value = true
      error.value = null

      const response = await $appwrite.databases.listDocuments(
        config.public.appwriteDatabaseId,
        config.public.appwriteCommentsCollectionId,
        [
          $appwrite.Query.equal('postId', postId),
          $appwrite.Query.limit(1000),
          $appwrite.Query.orderDesc('$createdAt')
        ]
      )

      const flatComments = response.documents as Comment[]
      comments.value = buildCommentTree(flatComments)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error loading comments'
      console.error('Error fetching comments:', err)
    } finally {
      loading.value = false
    }
  }

  const createComment = async (commentData: CommentCreate): Promise<Comment | null> => {
    try {
      loading.value = true
      error.value = null

      const response = await $appwrite.databases.createDocument(
        config.public.appwriteDatabaseId,
        config.public.appwriteCommentsCollectionId,
        $appwrite.ID.unique(),
        {
          ...commentData,
          upvotes: 0,
          downvotes: 0,
          score: 0,
          depth: commentData.parentId ? 1 : 0,
          childCount: 0
        }
      )

      const newComment = response as Comment
      
      // Add to local state
      if (commentData.parentId) {
        // Find parent and add as reply
        const addToParent = (comments: Comment[]): boolean => {
          for (const comment of comments) {
            if (comment.$id === commentData.parentId) {
              comment.replies = comment.replies || []
              comment.replies.push(newComment)
              comment.childCount = comment.replies.length
              return true
            }
            if (comment.replies && addToParent(comment.replies)) {
              return true
            }
          }
          return false
        }
        addToParent(comments.value)
      } else {
        // Add as root comment
        comments.value.unshift(newComment)
      }

      return newComment
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error creating comment'
      console.error('Error creating comment:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const voteComment = async (commentId: string, userId: string, voteType: 'upvote' | 'downvote') => {
    try {
      loading.value = true
      error.value = null

      // Check if user already voted
      const existingVotes = await $appwrite.databases.listDocuments(
        config.public.appwriteDatabaseId,
        config.public.appwriteVotesCollectionId,
        [
          $appwrite.Query.equal('userId', userId),
          $appwrite.Query.equal('commentId', commentId)
        ]
      )

      // Delete existing vote if any
      if (existingVotes.documents.length > 0) {
        await $appwrite.databases.deleteDocument(
          config.public.appwriteDatabaseId,
          config.public.appwriteVotesCollectionId,
          existingVotes.documents[0].$id
        )
      }

      // Create new vote (unless it's the same type - toggle behavior)
      const existingVote = existingVotes.documents[0] as Vote | undefined
      if (!existingVote || existingVote.type !== voteType) {
        await $appwrite.databases.createDocument(
          config.public.appwriteDatabaseId,
          config.public.appwriteVotesCollectionId,
          $appwrite.ID.unique(),
          {
            userId,
            commentId,
            type: voteType
          }
        )
      }

      // Recalculate vote counts
      const allVotes = await $appwrite.databases.listDocuments(
        config.public.appwriteDatabaseId,
        config.public.appwriteVotesCollectionId,
        [
          $appwrite.Query.equal('commentId', commentId),
          $appwrite.Query.limit(1000)
        ]
      )

      const upvotes = allVotes.documents.filter((vote: Vote) => vote.type === 'upvote').length
      const downvotes = allVotes.documents.filter((vote: Vote) => vote.type === 'downvote').length
      const score = upvotes - downvotes

      // Update comment in database
      await $appwrite.databases.updateDocument(
        config.public.appwriteDatabaseId,
        config.public.appwriteCommentsCollectionId,
        commentId,
        {
          upvotes,
          downvotes,
          score
        }
      )

      // Update local state
      const updateCommentVotes = (comments: Comment[]): void => {
        comments.forEach(comment => {
          if (comment.$id === commentId) {
            comment.upvotes = upvotes
            comment.downvotes = downvotes
            comment.score = score
          }
          if (comment.replies) {
            updateCommentVotes(comment.replies)
          }
        })
      }
      updateCommentVotes(comments.value)

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error voting on comment'
      console.error('Error voting on comment:', err)
    } finally {
      loading.value = false
    }
  }

  const sortComments = (sort: CommentSort) => {
    currentSort.value = sort
    comments.value = buildCommentTree(comments.value.flat())
  }

  const subscribeToComments = (postId: string) => {
    // TODO: Implement real-time subscription using Appwrite realtime
    // This would listen for changes to comments collection
    return () => {
      // Cleanup subscription
    }
  }

  return {
    comments: readonly(comments),
    loading: readonly(loading),
    error: readonly(error),
    currentSort: readonly(currentSort),
    fetchComments,
    createComment,
    voteComment,
    sortComments,
    subscribeToComments
  }
}