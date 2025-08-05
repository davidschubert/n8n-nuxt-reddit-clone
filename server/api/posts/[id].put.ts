import { getServerAppwrite } from '~/lib/server-appwrite'
import { validateUpdatePost } from '~/utils/validation'
import { sanitizeContent, sanitizeTitle, sanitizeTags, sanitizeImages } from '~/utils/sanitization'
import type { UpdatePostRequest, Post, ApiResponse } from '~/types/post'

export default defineEventHandler(async (event): Promise<ApiResponse<Post>> => {
  try {
    // Only allow PUT requests
    if (getMethod(event) !== 'PUT') {
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

    // Parse request body
    const body = await readBody(event) as UpdatePostRequest
    
    // Validate input
    const validationErrors = validateUpdatePost(body)
    if (validationErrors.length > 0) {
      return {
        success: false,
        errors: validationErrors
      }
    }

    // Build update data with sanitization
    const updateData: any = {}
    
    if (body.title !== undefined) {
      updateData.title = sanitizeTitle(body.title)
    }
    
    if (body.content !== undefined) {
      updateData.content = sanitizeContent(body.content)
    }
    
    if (body.tags !== undefined) {
      updateData.tags = sanitizeTags(body.tags)
    }
    
    if (body.images !== undefined) {
      updateData.images = sanitizeImages(body.images)
    }
    
    if (body.isPublished !== undefined) {
      updateData.isPublished = body.isPublished
    }

    // Check if post exists and get current data
    try {
      const existingPost = await databases.getDocument(
        config.appwriteDatabaseId,
        config.appwritePostsCollectionId,
        postId
      )

      // In a real app, you would check if the current user is the author
      // For now, we'll allow any update
      
    } catch (error: any) {
      if (error.type === 'document_not_found') {
        return {
          success: false,
          error: 'Post not found'
        }
      }
      throw error
    }

    // Update the post
    const updatedPost = await databases.updateDocument(
      config.appwriteDatabaseId,
      config.appwritePostsCollectionId,
      postId,
      updateData
    )

    return {
      success: true,
      data: updatedPost as Post
    }

  } catch (error: any) {
    console.error('Error updating post:', error)
    
    if (error.type === 'document_not_found') {
      return {
        success: false,
        error: 'Post not found'
      }
    }
    
    if (error.type === 'document_invalid_structure') {
      return {
        success: false,
        error: 'Invalid post data structure'
      }
    }

    return {
      success: false,
      error: error.message || 'Failed to update post'
    }
  }
})