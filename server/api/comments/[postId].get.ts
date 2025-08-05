import { useAppwrite } from '~/utils/appwrite'
import type { CommentQueryParams } from '~/types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  // Validate required parameters
  const postId = query.postId as string
  if (!postId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post ID is required'
    })
  }

  // Parse query parameters
  const params: CommentQueryParams = {
    postId,
    limit: parseInt(query.limit as string) || 50,
    offset: parseInt(query.offset as string) || 0,
    depth: parseInt(query.depth as string) || 3,
    parentId: query.parentId as string,
    cursor: query.cursor as string
  }

  try {
    const appwrite = useAppwrite()
    const response = await appwrite.getCommentsWithReplies(params)
    
    return {
      success: true,
      data: response,
      meta: {
        postId,
        count: response.comments.length,
        total: response.total,
        hasMore: response.hasMore,
        timestamp: Date.now()
      }
    }
  } catch (error: any) {
    console.error('API Error fetching comments:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch comments'
    })
  }
})