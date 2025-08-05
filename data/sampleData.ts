import type { Comment } from '~/types/comment'
import type { Post } from '~/types/post'

export const samplePosts: Post[] = [
  {
    id: '1',
    title: 'Welcome to our Reddit Clone!',
    content: 'This is the first post in our new Reddit clone. Feel free to comment and test the sorting functionality!',
    author: 'admin',
    score: 42,
    upvotes: 45,
    downvotes: 3,
    commentCount: 8,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T10:00:00Z')
  }
]

export const sampleComments: Comment[] = [
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