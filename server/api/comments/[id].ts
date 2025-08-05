import type { Comment, UpdateCommentPayload, ApiResponse, User } from '../../../types'

// Inline validation function to avoid import issues
const validateComment = (content: string): { isValid: boolean; error?: string } => {
  if (!content || content.trim().length === 0) {
    return { isValid: false, error: 'Comment cannot be empty' }
  }
  
  if (content.length > 10000) {
    return { isValid: false, error: 'Comment is too long (max 10,000 characters)' }
  }
  
  return { isValid: true }
}

// Mock data - in a real app, this would come from a database
const mockUsers: User[] = [
  { id: '1', username: 'alice', email: 'alice@example.com' },
  { id: '2', username: 'bob', email: 'bob@example.com' },
  { id: '3', username: 'charlie', email: 'charlie@example.com' }
]

const mockComments: Comment[] = [
  {
    id: '1',
    content: 'This is a great post! Thanks for sharing.',
    author: mockUsers[0],
    postId: 'post-1',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z'),
    votes: 5,
    replies: [
      {
        id: '2',
        content: 'I totally agree with @alice! This is very insightful.',
        author: mockUsers[1],
        postId: 'post-1',
        parentCommentId: '1',
        createdAt: new Date('2024-01-01T11:00:00Z'),
        updatedAt: new Date('2024-01-01T11:00:00Z'),
        votes: 2
      }
    ]
  },
  {
    id: '3',
    content: '**Bold statement**: This is exactly what I was looking for! \n\n> Thanks for the detailed explanation.\n\nSome code example:\n```javascript\nconsole.log("Hello World");\n```',
    author: mockUsers[2],
    postId: 'post-1',
    createdAt: new Date('2024-01-01T12:00:00Z'),
    updatedAt: new Date('2024-01-01T12:00:00Z'),
    votes: 8
  }
]

const getCurrentUser = (): User => {
  // In a real app, this would get the authenticated user
  return mockUsers[0]
}

const findCommentById = (commentId: string, comments: Comment[] = mockComments): Comment | null => {
  for (const comment of comments) {
    if (comment.id === commentId) {
      return comment
    }
    if (comment.replies) {
      const found = findCommentById(commentId, comment.replies)
      if (found) return found
    }
  }
  return null
}

const removeCommentById = (commentId: string, comments: Comment[] = mockComments): boolean => {
  for (let i = 0; i < comments.length; i++) {
    if (comments[i].id === commentId) {
      comments.splice(i, 1)
      return true
    }
    if (comments[i].replies && removeCommentById(commentId, comments[i].replies!)) {
      return true
    }
  }
  return false
}

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const commentId = getRouterParam(event, 'id')

  if (!commentId) {
    setResponseStatus(event, 400)
    return {
      success: false,
      error: 'Comment ID is required'
    } as ApiResponse<Comment>
  }

  try {
    switch (method) {
      case 'PUT': {
        const body = await readBody(event) as UpdateCommentPayload
        
        // Validate input
        if (!body.content) {
          setResponseStatus(event, 400)
          return {
            success: false,
            error: 'Content is required'
          } as ApiResponse<Comment>
        }

        // Validate content
        const validation = validateComment(body.content)
        if (!validation.isValid) {
          setResponseStatus(event, 400)
          return {
            success: false,
            error: validation.error
          } as ApiResponse<Comment>
        }

        // Find comment
        const comment = findCommentById(commentId)
        if (!comment) {
          setResponseStatus(event, 404)
          return {
            success: false,
            error: 'Comment not found'
          } as ApiResponse<Comment>
        }

        // Check authorization (in a real app)
        const currentUser = getCurrentUser()
        if (comment.author.id !== currentUser.id) {
          setResponseStatus(event, 403)
          return {
            success: false,
            error: 'Not authorized to edit this comment'
          } as ApiResponse<Comment>
        }

        // Update comment
        comment.content = body.content
        comment.updatedAt = new Date()

        return {
          success: true,
          data: comment
        } as ApiResponse<Comment>
      }

      case 'DELETE': {
        // Find comment
        const comment = findCommentById(commentId)
        if (!comment) {
          setResponseStatus(event, 404)
          return {
            success: false,
            error: 'Comment not found'
          } as ApiResponse<void>
        }

        // Check authorization (in a real app)
        const currentUser = getCurrentUser()
        if (comment.author.id !== currentUser.id) {
          setResponseStatus(event, 403)
          return {
            success: false,
            error: 'Not authorized to delete this comment'
          } as ApiResponse<void>
        }

        // Remove comment
        const removed = removeCommentById(commentId)
        if (!removed) {
          setResponseStatus(event, 500)
          return {
            success: false,
            error: 'Failed to delete comment'
          } as ApiResponse<void>
        }

        return {
          success: true,
          data: undefined
        } as ApiResponse<void>
      }

      default:
        setResponseStatus(event, 405)
        return {
          success: false,
          error: 'Method not allowed'
        } as ApiResponse<Comment>
    }
  } catch (error) {
    console.error('Comments API error:', error)
    setResponseStatus(event, 500)
    return {
      success: false,
      error: 'Internal server error'
    } as ApiResponse<Comment>
  }
})