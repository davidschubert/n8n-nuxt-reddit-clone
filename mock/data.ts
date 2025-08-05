import type { Comment, Post, User } from '~/types'

// Mock users
export const mockUsers: Record<string, User> = {
  'user1': {
    $id: 'user1',
    $collectionId: 'users',
    $databaseId: 'db1',
    $createdAt: '2023-01-01T00:00:00.000Z',
    $updatedAt: '2023-01-01T00:00:00.000Z',
    $permissions: [],
    username: 'alice_dev',
    email: 'alice@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice'
  },
  'user2': {
    $id: 'user2',
    $collectionId: 'users',
    $databaseId: 'db1',
    $createdAt: '2023-01-01T00:00:00.000Z',
    $updatedAt: '2023-01-01T00:00:00.000Z',
    $permissions: [],
    username: 'bob_coder',
    email: 'bob@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'
  },
  'user3': {
    $id: 'user3',
    $collectionId: 'users',
    $databaseId: 'db1',
    $createdAt: '2023-01-01T00:00:00.000Z',
    $updatedAt: '2023-01-01T00:00:00.000Z',
    $permissions: [],
    username: 'charlie_tech',
    email: 'charlie@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie'
  }
}

// Mock comments for demo-post
export const mockComments: Record<string, Comment[]> = {
  'demo-post': [
    {
      $id: 'comment1',
      $collectionId: 'comments',
      $databaseId: 'db1',
      $createdAt: '2023-12-01T10:00:00.000Z',
      $updatedAt: '2023-12-01T10:00:00.000Z',
      $permissions: [],
      content: 'This SSR implementation looks great! The comments load instantly and the hydration is seamless.',
      authorId: 'user1',
      author: mockUsers.user1,
      postId: 'demo-post',
      upvotes: 15,
      downvotes: 1,
      depth: 0,
      replyCount: 2,
      createdAt: '2023-12-01T10:00:00.000Z',
      updatedAt: '2023-12-01T10:00:00.000Z',
      replies: [
        {
          $id: 'comment1-1',
          $collectionId: 'comments',
          $databaseId: 'db1',
          $createdAt: '2023-12-01T10:30:00.000Z',
          $updatedAt: '2023-12-01T10:30:00.000Z',
          $permissions: [],
          content: 'Agreed! The performance is noticeably better compared to client-side only rendering.',
          authorId: 'user2',
          author: mockUsers.user2,
          postId: 'demo-post',
          parentId: 'comment1',
          upvotes: 8,
          downvotes: 0,
          depth: 1,
          replyCount: 1,
          createdAt: '2023-12-01T10:30:00.000Z',
          updatedAt: '2023-12-01T10:30:00.000Z',
          replies: [
            {
              $id: 'comment1-1-1',
              $collectionId: 'comments',
              $databaseId: 'db1',
              $createdAt: '2023-12-01T11:00:00.000Z',
              $updatedAt: '2023-12-01T11:00:00.000Z',
              $permissions: [],
              content: 'The Lighthouse scores must be much better with SSR. Great for SEO too!',
              authorId: 'user3',
              author: mockUsers.user3,
              postId: 'demo-post',
              parentId: 'comment1-1',
              upvotes: 5,
              downvotes: 0,
              depth: 2,
              replyCount: 0,
              createdAt: '2023-12-01T11:00:00.000Z',
              updatedAt: '2023-12-01T11:00:00.000Z',
              replies: []
            }
          ]
        },
        {
          $id: 'comment1-2',
          $collectionId: 'comments',
          $databaseId: 'db1',
          $createdAt: '2023-12-01T12:00:00.000Z',
          $updatedAt: '2023-12-01T12:00:00.000Z',
          $permissions: [],
          content: 'How does the caching work? Is it using Nuxt\'s built-in caching mechanisms?',
          authorId: 'user3',
          author: mockUsers.user3,
          postId: 'demo-post',
          parentId: 'comment1',
          upvotes: 3,
          downvotes: 0,
          depth: 1,
          replyCount: 0,
          createdAt: '2023-12-01T12:00:00.000Z',
          updatedAt: '2023-12-01T12:00:00.000Z',
          replies: []
        }
      ]
    },
    {
      $id: 'comment2',
      $collectionId: 'comments',
      $databaseId: 'db1',
      $createdAt: '2023-12-01T14:00:00.000Z',
      $updatedAt: '2023-12-01T14:00:00.000Z',
      $permissions: [],
      content: 'The nested comment threading is implemented really well. The depth limiting prevents infinite nesting while still allowing meaningful conversations.',
      authorId: 'user2',
      author: mockUsers.user2,
      postId: 'demo-post',
      upvotes: 12,
      downvotes: 0,
      depth: 0,
      replyCount: 0,
      createdAt: '2023-12-01T14:00:00.000Z',
      updatedAt: '2023-12-01T14:00:00.000Z',
      replies: []
    }
  ],
  'performance-demo': [
    {
      $id: 'perf-comment1',
      $collectionId: 'comments',
      $databaseId: 'db1',
      $createdAt: '2023-12-01T09:00:00.000Z',
      $updatedAt: '2023-12-01T09:00:00.000Z',
      $permissions: [],
      content: 'Testing the performance with a deeply nested comment thread. This is level 0.',
      authorId: 'user1',
      author: mockUsers.user1,
      postId: 'performance-demo',
      upvotes: 5,
      downvotes: 0,
      depth: 0,
      replyCount: 1,
      createdAt: '2023-12-01T09:00:00.000Z',
      updatedAt: '2023-12-01T09:00:00.000Z',
      replies: [
        {
          $id: 'perf-comment1-1',
          $collectionId: 'comments',
          $databaseId: 'db1',
          $createdAt: '2023-12-01T09:15:00.000Z',
          $updatedAt: '2023-12-01T09:15:00.000Z',
          $permissions: [],
          content: 'This is level 1. The lazy loading should kick in after a certain depth.',
          authorId: 'user2',
          author: mockUsers.user2,
          postId: 'performance-demo',
          parentId: 'perf-comment1',
          upvotes: 3,
          downvotes: 0,
          depth: 1,
          replyCount: 1,
          createdAt: '2023-12-01T09:15:00.000Z',
          updatedAt: '2023-12-01T09:15:00.000Z',
          replies: [
            {
              $id: 'perf-comment1-1-1',
              $collectionId: 'comments',
              $databaseId: 'db1',
              $createdAt: '2023-12-01T09:30:00.000Z',
              $updatedAt: '2023-12-01T09:30:00.000Z',
              $permissions: [],
              content: 'Level 2 - the SSR should handle this depth efficiently.',
              authorId: 'user3',
              author: mockUsers.user3,
              postId: 'performance-demo',
              parentId: 'perf-comment1-1',
              upvotes: 2,
              downvotes: 0,
              depth: 2,
              replyCount: 0,
              createdAt: '2023-12-01T09:30:00.000Z',
              updatedAt: '2023-12-01T09:30:00.000Z',
              replies: []
            }
          ]
        }
      ]
    }
  ]
}

// Mock posts
export const mockPosts: Record<string, Post> = {
  'demo-post': {
    $id: 'demo-post',
    $collectionId: 'posts',
    $databaseId: 'db1',
    $createdAt: '2023-12-01T08:00:00.000Z',
    $updatedAt: '2023-12-01T08:00:00.000Z',
    $permissions: [],
    title: 'Welcome to SSR Comments Demo',
    content: 'This is a demonstration of server-side rendered nested comments in a Nuxt.js Reddit clone. The comments below are loaded on the server and hydrated on the client for optimal performance and SEO.',
    authorId: 'user1',
    author: mockUsers.user1,
    upvotes: 25,
    downvotes: 2,
    commentCount: 5,
    createdAt: '2023-12-01T08:00:00.000Z',
    updatedAt: '2023-12-01T08:00:00.000Z'
  },
  'performance-demo': {
    $id: 'performance-demo',
    $collectionId: 'posts',
    $databaseId: 'db1',
    $createdAt: '2023-12-01T07:00:00.000Z',
    $updatedAt: '2023-12-01T07:00:00.000Z',
    $permissions: [],
    title: 'Performance Test Post with Many Comments',
    content: 'This post is designed to test comment loading performance with deeply nested comment threads. It demonstrates lazy loading, caching, and optimistic updates.',
    authorId: 'user2',
    author: mockUsers.user2,
    upvotes: 18,
    downvotes: 1,
    commentCount: 3,
    createdAt: '2023-12-01T07:00:00.000Z',
    updatedAt: '2023-12-01T07:00:00.000Z'
  }
}