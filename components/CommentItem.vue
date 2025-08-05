<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4">
    <!-- Comment Header -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium text-gray-900">{{ comment.authorName }}</span>
        <span class="text-xs text-gray-500">{{ formattedDate }}</span>
        <span v-if="comment.depth > 0" class="text-xs text-gray-400">
          → Antwort
        </span>
      </div>
      <div class="flex items-center space-x-1">
        <span class="text-sm text-gray-600">{{ comment.score }}</span>
        <ArrowUpIcon 
          class="w-4 h-4 cursor-pointer hover:text-green-600 transition-colors"
          :class="{ 'text-green-600': userVote === 'upvote' }"
          @click="onVote('upvote')"
        />
        <ArrowDownIcon 
          class="w-4 h-4 cursor-pointer hover:text-red-600 transition-colors"
          :class="{ 'text-red-600': userVote === 'downvote' }"
          @click="onVote('downvote')"
        />
      </div>
    </div>

    <!-- Comment Content -->
    <div class="mb-3">
      <p class="text-gray-800 whitespace-pre-wrap">{{ comment.content }}</p>
    </div>

    <!-- Comment Actions -->
    <div class="flex items-center space-x-4 text-sm text-gray-500">
      <button
        @click="toggleReply"
        class="hover:text-blue-600 transition-colors"
      >
        <ChatBubbleLeftIcon class="w-4 h-4 inline mr-1" />
        Antworten
      </button>
      <span>{{ comment.childCount }} Antworten</span>
    </div>

    <!-- Reply Form -->
    <div v-if="showReplyForm" class="mt-4 pl-4 border-l-2 border-gray-200">
      <CommentForm
        :parent-id="comment.$id"
        :post-id="comment.postId"
        @comment-created="onReplyCreated"
        @cancel="showReplyForm = false"
      />
    </div>

    <!-- Nested Replies -->
    <div v-if="comment.replies && comment.replies.length > 0" class="mt-4 pl-4 border-l-2 border-gray-200">
      <CommentItem
        v-for="reply in comment.replies"
        :key="reply.$id"
        :comment="reply"
        :current-user-id="currentUserId"
        class="mb-3 last:mb-0"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowUpIcon, ArrowDownIcon, ChatBubbleLeftIcon } from '@heroicons/vue/24/outline'
import type { Comment } from '~/types/comment'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface Props {
  comment: Comment
  currentUserId?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  replyCreated: [reply: Comment]
}>()

const { voteComment } = useComments()

const showReplyForm = ref(false)
const userVote = ref<'upvote' | 'downvote' | null>(null)

const formattedDate = computed(() => {
  return dayjs(props.comment.$createdAt).fromNow()
})

const toggleReply = () => {
  showReplyForm.value = !showReplyForm.value
}

const onVote = async (voteType: 'upvote' | 'downvote') => {
  if (!props.currentUserId) {
    // TODO: Show login prompt
    console.warn('User must be logged in to vote')
    return
  }

  await voteComment(props.comment.$id, props.currentUserId, voteType)
  
  // Update local vote state
  userVote.value = userVote.value === voteType ? null : voteType
}

const onReplyCreated = (reply: Comment) => {
  showReplyForm.value = false
  emit('replyCreated', reply)
}

// TODO: Fetch user's current vote status on mount
onMounted(() => {
  // Implementation would check if current user has voted on this comment
})
</script>