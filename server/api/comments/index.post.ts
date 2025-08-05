import type { Comment, CreateCommentPayload, ApiResponse, User } from '../../../types'

// Inline helper functions to avoid import issues
const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

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

// Rate limiting - simple in-memory store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 10 // max 10 comments per minute

  const userLimit = rateLimitStore.get(ip) || { count: 0, resetTime: now + windowMs }

  if (now > userLimit.resetTime) {
    // Reset window
    userLimit.count = 1
    userLimit.resetTime = now + windowMs
  } else {
    userLimit.count++
  }

  rateLimitStore.set(ip, userLimit)
  return userLimit.count <= maxRequests
}

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

const addReplyToComment = (parentId: string, newReply: Comment, comments: Comment[] = mockComments): boolean => {
  for (const comment of comments) {
    if (comment.id === parentId) {
      if (!comment.replies) comment.replies = []
      comment.replies.push(newReply)
      return true
    }
    if (comment.replies && addReplyToComment(parentId, newReply, comment.replies)) {
      return true
    }
  }
  return false
}

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const ip = getClientIP(event) || 'unknown'

  try {
    switch (method) {
      case 'GET': {
        const query = getQuery(event)
        const postId = query.postId as string

        if (!postId) {
          return {
            success: false,
            error: 'Post ID is required'
          } as ApiResponse<Comment[]>
        }

        // Filter comments by postId and only return top-level comments
        const postComments = mockComments.filter(comment => 
          comment.postId === postId && !comment.parentCommentId
        )

        return {
          success: true,
          data: postComments
        } as ApiResponse<Comment[]>
      }

      case 'POST': {
        // Check rate limit
        if (!checkRateLimit(ip)) {
          setResponseStatus(event, 429)
          return {
            success: false,
            error: 'Rate limit exceeded. Please try again later.'
          } as ApiResponse<Comment>
        }

        const body = await readBody(event) as CreateCommentPayload

        // Validate input
        if (!body.content || !body.postId) {
          setResponseStatus(event, 400)
          return {
            success: false,
            error: 'Content and post ID are required'
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

        // Create new comment
        const newComment: Comment = {
          id: generateId(),
          content: body.content,
          author: getCurrentUser(),
          postId: body.postId,
          parentCommentId: body.parentCommentId,
          createdAt: new Date(),
          updatedAt: new Date(),
          votes: 0
        }

        // Add to mock store
        if (body.parentCommentId) {
          // Add as reply
          const success = addReplyToComment(body.parentCommentId, newComment)
          if (!success) {
            setResponseStatus(event, 404)
            return {
              success: false,
              error: 'Parent comment not found'
            } as ApiResponse<Comment>
          }
        } else {
          // Add as top-level comment
          mockComments.push(newComment)
        }

        setResponseStatus(event, 201)
        return {
          success: true,
          data: newComment
        } as ApiResponse<Comment>
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