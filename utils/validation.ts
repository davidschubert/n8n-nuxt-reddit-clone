import type { CreatePostRequest, UpdatePostRequest, PostValidationError } from '~/types/post'

export function validateCreatePost(data: CreatePostRequest): PostValidationError[] {
  const errors: PostValidationError[] = []

  // Title validation
  if (!data.title || data.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title is required' })
  } else if (data.title.length > 200) {
    errors.push({ field: 'title', message: 'Title must be less than 200 characters' })
  }

  // Content validation
  if (!data.content || data.content.trim().length === 0) {
    errors.push({ field: 'content', message: 'Content is required' })
  } else if (data.content.length > 10000) {
    errors.push({ field: 'content', message: 'Content must be less than 10,000 characters' })
  }

  // Tags validation
  if (data.tags && data.tags.length > 10) {
    errors.push({ field: 'tags', message: 'Maximum 10 tags allowed' })
  }

  // Images validation
  if (data.images && data.images.length > 5) {
    errors.push({ field: 'images', message: 'Maximum 5 images allowed' })
  }

  return errors
}

export function validateUpdatePost(data: UpdatePostRequest): PostValidationError[] {
  const errors: PostValidationError[] = []

  // Title validation (if provided)
  if (data.title !== undefined) {
    if (data.title.trim().length === 0) {
      errors.push({ field: 'title', message: 'Title cannot be empty' })
    } else if (data.title.length > 200) {
      errors.push({ field: 'title', message: 'Title must be less than 200 characters' })
    }
  }

  // Content validation (if provided)
  if (data.content !== undefined) {
    if (data.content.trim().length === 0) {
      errors.push({ field: 'content', message: 'Content cannot be empty' })
    } else if (data.content.length > 10000) {
      errors.push({ field: 'content', message: 'Content must be less than 10,000 characters' })
    }
  }

  // Tags validation (if provided)
  if (data.tags && data.tags.length > 10) {
    errors.push({ field: 'tags', message: 'Maximum 10 tags allowed' })
  }

  // Images validation (if provided)
  if (data.images && data.images.length > 5) {
    errors.push({ field: 'images', message: 'Maximum 5 images allowed' })
  }

  return errors
}