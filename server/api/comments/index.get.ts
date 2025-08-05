import type { Comment, ApiResponse, User } from '../../../types'

// Mock data - same as in index.post.ts (in a real app, this would be shared from a database service)
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

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const postId = query.postId as string

  try {
    if (!postId) {
      setResponseStatus(event, 400)
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
  } catch (error) {
    console.error('Comments API error:', error)
    setResponseStatus(event, 500)
    return {
      success: false,
      error: 'Internal server error'
    } as ApiResponse<Comment[]>
  }
})