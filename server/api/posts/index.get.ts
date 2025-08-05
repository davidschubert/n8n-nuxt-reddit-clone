import { getServerAppwrite } from '~/lib/server-appwrite'
import type { Post, ApiResponse } from '~/types/post'

export default defineEventHandler(async (event): Promise<ApiResponse<Post[]>> => {
  try {
    const config = useRuntimeConfig()
    const { databases } = getServerAppwrite(config)
    
    if (!databases) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database connection failed'
      })
    }

    // Get query parameters for pagination and filtering
    const query = getQuery(event)
    const limit = Math.min(parseInt(query.limit as string) || 20, 100) // Max 100 posts per request
    const offset = parseInt(query.offset as string) || 0
    const published = query.published !== 'false' // Default to published posts only

    // Build queries array
    const queries = []
    
    if (published) {
      queries.push(`isPublished:true`)
    }

    // Fetch posts from Appwrite
    const response = await databases.listDocuments(
      config.appwriteDatabaseId,
      config.appwritePostsCollectionId,
      queries
    )

    return {
      success: true,
      data: response.documents as Post[]
    }

  } catch (error: any) {
    console.error('Error fetching posts:', error)
    
    if (error.type === 'collection_not_found') {
      return {
        success: false,
        error: 'Posts collection not found. Please configure Appwrite properly.'
      }
    }

    return {
      success: false,
      error: error.message || 'Failed to fetch posts'
    }
  }
})