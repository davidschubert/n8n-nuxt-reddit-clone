import type { CommentSortType } from '../../../types/comment'

// Sample comments data
const sampleComments = [
  {
    id: '1',
    postId: '1',
    author: 'user1',
    content: 'Great project! Really excited to see this develop.',
    score: 15,
    upvotes: 18,
    downvotes: 3,
    createdAt: new Date('2024-01-01T11:00:00Z'),
    updatedAt: new Date('2024-01-01T11:00:00Z')
  },
  {
    id: '2',
    postId: '1',
    author: 'user2',
    content: 'This comment sorting feature is exactly what we needed!',
    score: 8,
    upvotes: 10,
    downvotes: 2,
    createdAt: new Date('2024-01-01T14:30:00Z'),
    updatedAt: new Date('2024-01-01T14:30:00Z')
  },
  {
    id: '3',
    postId: '1',
    author: 'user3',
    content: 'I disagree with the implementation approach.',
    score: -2,
    upvotes: 12,
    downvotes: 14,
    createdAt: new Date('2024-01-01T09:15:00Z'),
    updatedAt: new Date('2024-01-01T09:15:00Z')
  },
  {
    id: '4',
    postId: '1',
    author: 'user4',
    content: 'The new sorting works perfectly! Thanks for implementing this.',
    score: 25,
    upvotes: 27,
    downvotes: 2,
    createdAt: new Date('2024-01-01T16:45:00Z'),
    updatedAt: new Date('2024-01-01T16:45:00Z')
  },
  {
    id: '5',
    postId: '1',
    author: 'user5',
    content: 'Controversial comment that generates lots of discussion.',
    score: 2,
    upvotes: 20,
    downvotes: 18,
    createdAt: new Date('2024-01-01T12:20:00Z'),
    updatedAt: new Date('2024-01-01T12:20:00Z')
  },
  {
    id: '6',
    postId: '1',
    author: 'user6',
    content: 'Just posted this comment to test the newest sorting.',
    score: 5,
    upvotes: 6,
    downvotes: 1,
    createdAt: new Date('2024-01-01T18:00:00Z'),
    updatedAt: new Date('2024-01-01T18:00:00Z')
  },
  {
    id: '7',
    postId: '1',
    author: 'user7',
    content: 'This is an older comment from earlier today.',
    score: 3,
    upvotes: 4,
    downvotes: 1,
    createdAt: new Date('2024-01-01T08:30:00Z'),
    updatedAt: new Date('2024-01-01T08:30:00Z')
  },
  {
    id: '8',
    postId: '1',
    author: 'user8',
    content: 'Another controversial take on this implementation.',
    score: 0,
    upvotes: 15,
    downvotes: 15,
    createdAt: new Date('2024-01-01T13:10:00Z'),
    updatedAt: new Date('2024-01-01T13:10:00Z')
  }
]

// Comment sorting function
function sortComments(comments: any[], sortBy: CommentSortType) {
  const sortedComments = [...comments]

  switch (sortBy) {
    case 'popular':
      return sortedComments.sort((a, b) => b.score - a.score)
    
    case 'new':
      return sortedComments.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    
    case 'old':
      return sortedComments.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    
    case 'controversial':
      return sortedComments.sort((a, b) => {
        const aEngagement = a.upvotes + a.downvotes
        const bEngagement = b.upvotes + b.downvotes
        
        if (aEngagement === 0 && bEngagement === 0) {
          return b.score - a.score
        }
        
        const aControversy = aEngagement > 0 ? Math.min(a.upvotes, a.downvotes) / aEngagement : 0
        const bControversy = bEngagement > 0 ? Math.min(b.upvotes, b.downvotes) / bEngagement : 0
        
        return bControversy - aControversy || bEngagement - aEngagement
      })
    
    default:
      return sortedComments
  }
}

export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'id')
  const query = getQuery(event)
  
  // Get sorting parameters from query
  const sortBy = (query.sort as CommentSortType) || 'popular'
  
  if (!postId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post ID is required'
    })
  }

  // Filter comments for this post
  const postComments = sampleComments.filter(comment => comment.postId === postId)
  
  // Sort comments based on the sortBy parameter
  const sortedComments = sortComments(postComments, sortBy)
  
  // Add a small delay to simulate real API behavior
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return {
    comments: sortedComments,
    sortBy,
    total: sortedComments.length
  }
})