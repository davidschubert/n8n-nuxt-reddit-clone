import { ID } from 'appwrite'
import { getServerAppwrite } from '~/lib/server-appwrite'
import { validateCreatePost } from '~/utils/validation'
import { sanitizeContent, sanitizeTitle, sanitizeTags, sanitizeImages } from '~/utils/sanitization'
import type { CreatePostRequest, Post, ApiResponse } from '~/types/post'

export default defineEventHandler(async (event): Promise<ApiResponse<Post>> => {
  try {
    // Only allow POST requests
    if (getMethod(event) !== 'POST') {
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

    // Parse request body
    const body = await readBody(event) as CreatePostRequest
    
    // Validate input
    const validationErrors = validateCreatePost(body)
    if (validationErrors.length > 0) {
      return {
        success: false,
        errors: validationErrors
      }
    }

    // Sanitize input data
    const sanitizedData = {
      title: sanitizeTitle(body.title),
      content: sanitizeContent(body.content),
      tags: sanitizeTags(body.tags || []),
      images: sanitizeImages(body.images || []),
      isPublished: body.isPublished ?? true
    }

    // For now, use a placeholder authorId (in real app, this would come from authentication)
    const authorId = 'user_placeholder'

    // Create post document
    const postData = {
      title: sanitizedData.title,
      content: sanitizedData.content,
      authorId,
      upvotes: 0,
      downvotes: 0,
      commentCount: 0,
      tags: sanitizedData.tags,
      images: sanitizedData.images,
      isPublished: sanitizedData.isPublished
    }

    const createdPost = await databases.createDocument(
      config.appwriteDatabaseId,
      config.appwritePostsCollectionId,
      ID.unique(),
      postData
    )

    return {
      success: true,
      data: createdPost as Post
    }

  } catch (error: any) {
    console.error('Error creating post:', error)
    
    // Handle Appwrite specific errors
    if (error.type === 'document_invalid_structure') {
      return {
        success: false,
        error: 'Invalid post data structure'
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
      error: error.message || 'Failed to create post'
    }
  }
})