<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Reddit Clone - Comment Voting System
        </h1>
        <p class="text-gray-600 mb-4">
          Demo of the upvote/downvote functionality for comments
        </p>
        
        <!-- User Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Simulate User:
          </label>
          <select
            v-model="currentUser"
            class="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="alice">Alice</option>
            <option value="bob">Bob</option>
            <option value="charlie">Charlie</option>
            <option value="diana">Diana</option>
          </select>
        </div>

        <!-- Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-blue-900">Total Votes</h3>
            <p class="text-2xl font-bold text-blue-600">{{ totalVotes }}</p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-green-900">Total Upvotes</h3>
            <p class="text-2xl font-bold text-green-600">{{ totalUpvotes }}</p>
          </div>
          <div class="bg-red-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-red-900">Total Downvotes</h3>
            <p class="text-2xl font-bold text-red-600">{{ totalDownvotes }}</p>
          </div>
        </div>
      </div>

      <!-- Comments Section -->
      <div class="space-y-4">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Comments</h2>
        
        <CommentComponent
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          :current-user="currentUser"
        />
      </div>

      <!-- Add Comment Button -->
      <button
        @click="addRandomComment"
        class="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add Random Comment
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from '~/types'

// Set page title
useHead({
  title: 'Reddit Clone - Comment Voting'
})

const currentUser = ref('alice')
const voteStore = useVoteStore()

// Sample comments data
const comments = ref<Comment[]>([
  {
    id: 'comment-1',
    content: 'This is a great post! Thanks for sharing this information.',
    author: 'bob',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    score: 5,
    userVote: null
  },
  {
    id: 'comment-2',
    content: 'I disagree with this approach. There are better ways to handle this.',
    author: 'charlie',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    score: -2,
    userVote: null,
    replies: [
      {
        id: 'comment-2-1',
        content: 'Can you elaborate on what you think would be better?',
        author: 'diana',
        createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        score: 3,
        userVote: null
      }
    ]
  },
  {
    id: 'comment-3',
    content: 'Very informative! I learned something new today.',
    author: 'diana',
    createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    score: 8,
    userVote: null
  },
  {
    id: 'comment-4',
    content: 'Has anyone else experienced similar issues?',
    author: 'alice',
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    score: 1,
    userVote: null
  }
])

// Computed statistics
const totalVotes = computed(() => {
  let total = 0
  const countVotes = (commentList: Comment[]) => {
    commentList.forEach(comment => {
      const score = voteStore.getScore(comment.id) ?? comment.score
      total += Math.abs(score)
      if (comment.replies) {
        countVotes(comment.replies)
      }
    })
  }
  countVotes(comments.value)
  return total
})

const totalUpvotes = computed(() => {
  let upvotes = 0
  const countUpvotes = (commentList: Comment[]) => {
    commentList.forEach(comment => {
      const score = voteStore.getScore(comment.id) ?? comment.score
      if (score > 0) upvotes += score
      if (comment.replies) {
        countUpvotes(comment.replies)
      }
    })
  }
  countUpvotes(comments.value)
  return upvotes
})

const totalDownvotes = computed(() => {
  let downvotes = 0
  const countDownvotes = (commentList: Comment[]) => {
    commentList.forEach(comment => {
      const score = voteStore.getScore(comment.id) ?? comment.score
      if (score < 0) downvotes += Math.abs(score)
      if (comment.replies) {
        countDownvotes(comment.replies)
      }
    })
  }
  countDownvotes(comments.value)
  return downvotes
})

// Add a random comment for testing
const addRandomComment = () => {
  const randomContent = [
    'This is an excellent point!',
    'I think there might be an issue with this approach.',
    'Great discussion, everyone!',
    'Can someone explain this in more detail?',
    'I have a different perspective on this.',
    'Thanks for the clarification!',
    'This helped me understand the concept better.',
    'I found a similar solution that works well.'
  ]
  
  const randomAuthors = ['alice', 'bob', 'charlie', 'diana']
  
  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    content: randomContent[Math.floor(Math.random() * randomContent.length)],
    author: randomAuthors[Math.floor(Math.random() * randomAuthors.length)],
    createdAt: new Date(),
    score: Math.floor(Math.random() * 10) - 3, // -3 to 6
    userVote: null
  }
  
  comments.value.unshift(newComment)
}

// Set user ID cookie for API
onMounted(() => {
  // Set a cookie for demo purposes
  const userCookie = useCookie('userId')
  userCookie.value = currentUser.value
})

// Update cookie when user changes
watch(currentUser, (newUser) => {
  const userCookie = useCookie('userId')
  userCookie.value = newUser
})
</script>