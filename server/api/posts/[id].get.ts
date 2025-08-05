import { getServerAppwrite } from '~/lib/server-appwrite'
import type { Post, ApiResponse } from '~/types/post'

export default defineEventHandler(async (event): Promise<ApiResponse<Post>> => {
  try {
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

    // Fetch the post
    const post = await databases.getDocument(
      config.appwriteDatabaseId,
      config.appwritePostsCollectionId,
      postId
    )

    return {
      success: true,
      data: post as Post
    }

  } catch (error: any) {
    console.error('Error fetching post:', error)
    
    if (error.type === 'document_not_found') {
      return {
        success: false,
        error: 'Post not found'
      }
    }
    
    if (error.type === 'collection_not_found') {
      return {
        success: false,
        error: 'Posts collection not found. Please configure Appwrite properly.'
      }
    }

    return {
      success: false,
      error: error.message || 'Failed to fetch post'
    }
  }
})