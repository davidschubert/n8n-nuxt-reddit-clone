<template>
  <div class="comment-editor bg-white">
    <!-- Toolbar -->
    <div class="flex items-center justify-between p-3 border-b border-gray-200">
      <div class="flex items-center space-x-2">
        <button
          @click="togglePreview"
          class="px-3 py-1 text-sm font-medium rounded-md transition-colors"
          :class="isPreviewMode ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >
          {{ isPreviewMode ? 'Edit' : 'Preview' }}
        </button>
        
        <div class="h-4 w-px bg-gray-300"></div>
        
        <button
          @click="insertMarkdown('**', '**')"
          class="p-1 rounded hover:bg-gray-100"
          title="Bold (Ctrl+B)"
        >
          <Bold class="w-4 h-4" />
        </button>
        
        <button
          @click="insertMarkdown('*', '*')"
          class="p-1 rounded hover:bg-gray-100"
          title="Italic (Ctrl+I)"
        >
          <Italic class="w-4 h-4" />
        </button>
        
        <button
          @click="insertMarkdown('[', '](url)')"
          class="p-1 rounded hover:bg-gray-100"
          title="Link"
        >
          <Link class="w-4 h-4" />
        </button>
        
        <button
          @click="insertMarkdown('\n> ', '')"
          class="p-1 rounded hover:bg-gray-100"
          title="Quote"
        >
          <Quote class="w-4 h-4" />
        </button>
      </div>
      
      <div class="flex items-center space-x-2 text-sm text-gray-500">
        <span v-if="characterCount > 0" :class="{ 'text-red-500': characterCount > 10000 }">
          {{ characterCount.toLocaleString() }}/10,000
        </span>
        <span v-if="lastSaved" class="text-xs">
          Saved {{ formatRelativeTime(lastSaved) }}
        </span>
      </div>
    </div>

    <!-- Editor Content -->
    <div class="relative">
      <!-- Edit Mode -->
      <div v-if="!isPreviewMode" class="relative">
        <textarea
          ref="textareaRef"
          v-model="content"
          @input="onInput"
          @keydown="onKeydown"
          class="w-full p-4 border-0 resize-none focus:outline-none min-h-[120px] font-mono text-sm leading-relaxed"
          :placeholder="placeholder"
          :disabled="isSubmitting"
        />
        
        <!-- Mention Dropdown -->
        <div
          v-if="showMentions"
          class="absolute bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
          :style="mentionDropdownStyle"
        >
          <div
            v-for="(user, index) in filteredMentionUsers"
            :key="user.id"
            @click="selectMention(user)"
            class="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
            :class="{ 'bg-blue-50': index === selectedMentionIndex }"
          >
            <div class="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
            <span class="font-medium">{{ user.username }}</span>
          </div>
          <div v-if="filteredMentionUsers.length === 0" class="px-3 py-2 text-gray-500 text-sm">
            No users found
          </div>
        </div>
      </div>

      <!-- Preview Mode -->
      <div
        v-else
        class="p-4 min-h-[120px] markdown-content"
        v-html="renderedContent"
      />
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between p-3 border-t border-gray-200 bg-gray-50">
      <div class="flex items-center space-x-4 text-xs text-gray-500">
        <span>Markdown supported</span>
        <span>@mention users</span>
        <span>Ctrl+Enter to submit</span>
      </div>
      
      <div class="flex items-center space-x-2">
        <button
          v-if="onCancel"
          @click="onCancel"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :disabled="isSubmitting"
        >
          Cancel
        </button>
        
        <button
          @click="submitComment"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!canSubmit || isSubmitting"
        >
          <span v-if="isSubmitting" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Posting...
          </span>
          <span v-else>Post Comment</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bold, Italic, Link, Quote } from 'lucide-vue-next'
import type { CommentEditorProps, MentionUser } from '~/types'
import { renderMarkdown, processMentions, validateComment, formatRelativeTime } from '~/utils/markdown'

const props = withDefaults(defineProps<CommentEditorProps>(), {
  initialValue: '',
  placeholder: 'What are your thoughts?'
})

const emit = defineEmits<{
  submit: [content: string]
  cancel: []
}>()

// Refs
const textareaRef = ref<HTMLTextAreaElement>()
const content = ref(props.initialValue)
const isPreviewMode = ref(false)
const isSubmitting = ref(false)
const showMentions = ref(false)
const selectedMentionIndex = ref(0)
const mentionQuery = ref('')
const mentionPosition = ref({ top: 0, left: 0 })
const lastSaved = ref<Date | null>(null)

// Draft management
const { getDraft, createAutoSave, removeDraft } = useDrafts()
const autoSave = createAutoSave(props.postId, props.parentCommentId)

// Mock users for mentions (in a real app, this would come from an API)
const mentionUsers = ref<MentionUser[]>([
  { id: '1', username: 'alice', avatar: '' },
  { id: '2', username: 'bob', avatar: '' },
  { id: '3', username: 'charlie', avatar: '' },
  { id: '4', username: 'diana', avatar: '' }
])

// Computed
const characterCount = computed(() => content.value.length)

const canSubmit = computed(() => {
  const validation = validateComment(content.value)
  return validation.isValid && !isSubmitting.value
})

const renderedContent = computed(() => {
  const processedContent = processMentions(content.value)
  return renderMarkdown(processedContent)
})

const filteredMentionUsers = computed(() => {
  if (!mentionQuery.value) return mentionUsers.value
  return mentionUsers.value.filter(user =>
    user.username.toLowerCase().includes(mentionQuery.value.toLowerCase())
  )
})

const mentionDropdownStyle = computed(() => ({
  top: `${mentionPosition.value.top}px`,
  left: `${mentionPosition.value.left}px`
}))

// Methods
const togglePreview = () => {
  isPreviewMode.value = !isPreviewMode.value
}

const onInput = () => {
  autoSave(content.value)
  lastSaved.value = new Date()
  checkForMentions()
}

const onKeydown = (event: KeyboardEvent) => {
  // Handle Ctrl+Enter for submit
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault()
    submitComment()
    return
  }

  // Handle mention navigation
  if (showMentions.value) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      selectedMentionIndex.value = Math.min(
        selectedMentionIndex.value + 1,
        filteredMentionUsers.value.length - 1
      )
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      selectedMentionIndex.value = Math.max(selectedMentionIndex.value - 1, 0)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const selectedUser = filteredMentionUsers.value[selectedMentionIndex.value]
      if (selectedUser) {
        selectMention(selectedUser)
      }
    } else if (event.key === 'Escape') {
      showMentions.value = false
    }
  }

  // Handle markdown shortcuts
  if (event.ctrlKey || event.metaKey) {
    if (event.key === 'b') {
      event.preventDefault()
      insertMarkdown('**', '**')
    } else if (event.key === 'i') {
      event.preventDefault()
      insertMarkdown('*', '*')
    }
  }
}

const insertMarkdown = (before: string, after: string) => {
  if (!textareaRef.value) return

  const textarea = textareaRef.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = content.value.substring(start, end)

  const newContent = 
    content.value.substring(0, start) +
    before +
    selectedText +
    after +
    content.value.substring(end)

  content.value = newContent

  // Set cursor position
  nextTick(() => {
    if (selectedText) {
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    } else {
      textarea.setSelectionRange(start + before.length, start + before.length)
    }
    textarea.focus()
  })
}

const checkForMentions = () => {
  if (!textareaRef.value) return

  const textarea = textareaRef.value
  const cursorPosition = textarea.selectionStart
  const textBeforeCursor = content.value.substring(0, cursorPosition)
  const mentionMatch = textBeforeCursor.match(/@(\w*)$/)

  if (mentionMatch) {
    mentionQuery.value = mentionMatch[1]
    selectedMentionIndex.value = 0
    showMentions.value = true

    // Calculate dropdown position
    const textMetrics = getTextMetrics(textBeforeCursor, textarea)
    mentionPosition.value = {
      top: textMetrics.top + 20,
      left: textMetrics.left
    }
  } else {
    showMentions.value = false
  }
}

const getTextMetrics = (text: string, textarea: HTMLTextAreaElement) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!
  context.font = getComputedStyle(textarea).font

  const lines = text.split('\n')
  const lineHeight = 20 // Approximate line height
  const top = (lines.length - 1) * lineHeight
  const left = context.measureText(lines[lines.length - 1]).width

  return { top, left }
}

const selectMention = (user: MentionUser) => {
  if (!textareaRef.value) return

  const textarea = textareaRef.value
  const cursorPosition = textarea.selectionStart
  const textBeforeCursor = content.value.substring(0, cursorPosition)
  const textAfterCursor = content.value.substring(cursorPosition)
  
  const mentionStart = textBeforeCursor.lastIndexOf('@')
  const newContent = 
    content.value.substring(0, mentionStart) +
    `@${user.username}` +
    textAfterCursor

  content.value = newContent
  showMentions.value = false

  // Set cursor position after the mention
  nextTick(() => {
    const newCursorPosition = mentionStart + user.username.length + 1
    textarea.setSelectionRange(newCursorPosition, newCursorPosition)
    textarea.focus()
  })
}

const submitComment = async () => {
  if (!canSubmit.value) return

  isSubmitting.value = true

  try {
    emit('submit', content.value)
    
    // Clear content and draft after successful submission
    content.value = ''
    removeDraft(props.postId, props.parentCommentId)
    lastSaved.value = null
  } catch (error) {
    console.error('Error submitting comment:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Load draft on mount
onMounted(() => {
  if (!props.initialValue) {
    const draft = getDraft(props.postId, props.parentCommentId)
    if (draft) {
      content.value = draft.content
      lastSaved.value = draft.lastSaved
    }
  }
})

// Clean up on unmount
onUnmounted(() => {
  // Save current content as draft if it's not empty
  if (content.value.trim()) {
    autoSave(content.value)
  }
})
</script>