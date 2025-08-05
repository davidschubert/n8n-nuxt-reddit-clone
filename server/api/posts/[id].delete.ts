import { getServerAppwrite } from '~/lib/server-appwrite'
import type { ApiResponse } from '~/types/post'

export default defineEventHandler(async (event): Promise<ApiResponse<{ deleted: boolean }>> => {
  try {
    // Only allow DELETE requests
    if (getMethod(event) !== 'DELETE') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }

    const config = useRuntimeConfig()
    const { databases } = getServerAppwrite(config)
    
    if (!databases) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database connection failed'
      })
    }

    // Get post ID from URL
    const postId = getRouterParam(event, 'id')
    if (!postId) {
      return {
        success: false,
        error: 'Post ID is required'
      }
    }

    // Check if post exists and get current data for authorization
    try {
      const existingPost = await databases.getDocument(
        config.appwriteDatabaseId,
        config.appwritePostsCollectionId,
        postId
      )

      // In a real app, you would check if the current user is the author
      // For now, we'll allow any deletion
      
    } catch (error: any) {
      if (error.type === 'document_not_found') {
        return {
          success: false,
          error: 'Post not found'
        }
      }
      throw error
    }

    // Delete the post
    await databases.deleteDocument(
      config.appwriteDatabaseId,
      config.appwritePostsCollectionId,
      postId
    )

    return {
      success: true,
      data: { deleted: true }
    }

  } catch (error: any) {
    console.error('Error deleting post:', error)
    
    if (error.type === 'document_not_found') {
      return {
        success: false,
        error: 'Post not found'
      }
    }

    return {
      success: false,
      error: error.message || 'Failed to delete post'
    }
  }
})