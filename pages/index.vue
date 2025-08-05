<template>
  <div class="demo-page">
    <header class="demo-header">
      <h1>Reddit-Style Comment System Demo</h1>
      <p>A fully functional comment system with nested replies, voting, and accessibility features.</p>
    </header>

    <main class="demo-content">
      <!-- Sample post -->
      <article class="demo-post">
        <h2>Sample Reddit Post</h2>
        <p>
          This is a sample post to demonstrate the comment system. The comment system below supports:
        </p>
        <ul>
          <li>Nested replies with visual thread indicators</li>
          <li>Collapse/expand functionality for long threads</li>
          <li>Like/unlike functionality</li>
          <li>Mobile-responsive design</li>
          <li>Accessibility features (ARIA labels, keyboard navigation)</li>
          <li>Loading states and error handling</li>
        </ul>
      </article>

      <!-- Comment system -->
      <CommentThread
        :comments="sampleComments"
        :postId="'demo-post-1'"
        :maxDepth="8"
        @comment-added="handleCommentAdded"
        @comment-updated="handleCommentUpdated"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from '~/types/comment'

// Meta tags
useHead({
  title: 'Comment System Demo - Reddit Clone',
  meta: [
    { name: 'description', content: 'Demo of a Reddit-style comment system with nested replies' }
  ]
})

// Sample data
const sampleComments = ref<Comment[]>([
  {
    id: 'comment-1',
    content: 'This is a great implementation! I love how the threading works.',
    author: 'TechEnthusiast',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    replies: [
      {
        id: 'comment-1-1',
        content: 'I agree! The visual indicators make it easy to follow conversations.',
        author: 'UIDesigner',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
        parentId: 'comment-1',
        replies: [
          {
            id: 'comment-1-1-1',
            content: 'The accessibility features are particularly well done.',
            author: 'A11yAdvocate',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
            parentId: 'comment-1-1',
            replies: [],
            depth: 2,
            likes: 5,
            isLiked: false
          }
        ],
        depth: 1,
        likes: 8,
        isLiked: true
      },
      {
        id: 'comment-1-2',
        content: 'How deep can the nesting go? This could get interesting with long discussions.',
        author: 'DeepThinker',
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        parentId: 'comment-1',
        replies: [
          {
            id: 'comment-1-2-1',
            content: 'The system supports up to 10 levels by default, but it\'s configurable.',
            author: 'Developer',
            timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            parentId: 'comment-1-2',
            replies: [
              {
                id: 'comment-1-2-1-1',
                content: 'That\'s perfect for most use cases. Beyond that depth, it might get hard to read anyway.',
                author: 'UXExpert',
                timestamp: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
                parentId: 'comment-1-2-1',
                replies: [
                  {
                    id: 'comment-1-2-1-1-1',
                    content: 'Exactly! And the collapse feature helps with performance on long threads.',
                    author: 'PerformanceGuru',
                    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
                    parentId: 'comment-1-2-1-1',
                    replies: [],
                    depth: 4,
                    likes: 3,
                    isLiked: false
                  }
                ],
                depth: 3,
                likes: 7,
                isLiked: false
              }
            ],
            depth: 2,
            likes: 12,
            isLiked: true
          }
        ],
        depth: 1,
        likes: 4,
        isLiked: false
      }
    ],
    depth: 0,
    likes: 15,
    isLiked: true
  },
  {
    id: 'comment-2',
    content: 'The mobile responsiveness is excellent. Works great on my phone!',
    author: 'MobileUser',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    replies: [
      {
        id: 'comment-2-1',
        content: 'Yes! The touch interactions feel natural and the spacing is perfect.',
        author: 'TouchInterface',
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000), // 2.5 hours ago
        parentId: 'comment-2',
        replies: [],
        depth: 1,
        likes: 6,
        isLiked: false
      }
    ],
    depth: 0,
    likes: 9,
    isLiked: false
  },
  {
    id: 'comment-3',
    content: 'I appreciate the keyboard navigation support. As someone who uses screen readers, this is very well implemented.',
    author: 'AccessibilityUser',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    replies: [
      {
        id: 'comment-3-1',
        content: 'The ARIA labels are spot on. It\'s clear a lot of thought went into making this inclusive.',
        author: 'ScreenReaderUser',
        timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000), // 3.5 hours ago
        parentId: 'comment-3',
        replies: [
          {
            id: 'comment-3-1-1',
            content: 'The focus management when navigating between replies is particularly well done.',
            author: 'KeyboardNavigator',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
            parentId: 'comment-3-1',
            replies: [],
            depth: 2,
            likes: 8,
            isLiked: true
          }
        ],
        depth: 1,
        likes: 11,
        isLiked: true
      }
    ],
    depth: 0,
    likes: 13,
    isLiked: true,
    isCollapsed: false
  },
  {
    id: 'comment-4',
    content: 'The loading states are smooth and the error handling seems robust. Good job on the technical implementation!',
    author: 'QualityAssurance',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    replies: [],
    depth: 0,
    likes: 7,
    isLiked: false
  }
])

// Event handlers
const handleCommentAdded = (comment: Comment) => {
  sampleComments.value.unshift(comment)
  console.log('New comment added:', comment)
}

const handleCommentUpdated = (comment: Comment) => {
  console.log('Comment updated:', comment)
}

// Provide sample data for development
provide('sampleData', {
  comments: sampleComments,
  totalComments: computed(() => {
    const countComments = (comments: Comment[]): number => {
      return comments.reduce((total, comment) => {
        return total + 1 + countComments(comment.replies)
      }, 0)
    }
    return countComments(sampleComments.value)
  })
})
</script>

<style scoped>
.demo-page {
  min-height: 100vh;
  background-color: #f8fafc;
}

.demo-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 1rem;
  text-align: center;
}

.demo-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.demo-header p {
  font-size: 1.125rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.demo-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.demo-post {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.demo-post h2 {
  color: #111827;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.demo-post p {
  color: #374151;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.demo-post ul {
  color: #374151;
  line-height: 1.6;
  padding-left: 1.5rem;
}

.demo-post li {
  margin-bottom: 0.5rem;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .demo-header {
    padding: 2rem 1rem;
  }
  
  .demo-header h1 {
    font-size: 2rem;
  }
  
  .demo-header p {
    font-size: 1rem;
  }
  
  .demo-content {
    padding: 1rem;
  }
  
  .demo-post {
    padding: 1.5rem;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .demo-post {
    border-color: #000000;
  }
}
</style>