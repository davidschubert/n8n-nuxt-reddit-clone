<template>
  <div class="post-editor">
    <!-- Editor Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Create Post</h2>
      <div class="flex items-center gap-3">
        <div class="auto-save-indicator" :class="autoSaveStatus">
          <UIcon v-if="autoSaveStatus === 'saving'" name="i-heroicons-arrow-path" class="animate-spin" />
          <UIcon v-else-if="autoSaveStatus === 'saved'" name="i-heroicons-check-circle" />
          <UIcon v-else-if="autoSaveStatus === 'error'" name="i-heroicons-exclamation-circle" />
          {{ autoSaveMessage }}
        </div>
        <UButton 
          :variant="previewMode ? 'solid' : 'outline'" 
          @click="togglePreview"
          icon="i-heroicons-eye"
        >
          {{ previewMode ? 'Edit' : 'Preview' }}
        </UButton>
      </div>
    </div>

    <!-- Title Input -->
    <div class="mb-4">
      <UInput
        v-model="post.title"
        placeholder="Enter post title..."
        size="lg"
        :maxlength="titleMaxLength"
        @input="handleTitleChange"
      />
      <div class="character-count" :class="{ 'warning': post.title.length > titleMaxLength * 0.8, 'error': post.title.length >= titleMaxLength }">
        {{ post.title.length }}/{{ titleMaxLength }}
      </div>
    </div>

    <!-- Editor Toolbar -->
    <div v-if="!previewMode" class="editor-toolbar">
      <UButton
        v-for="action in toolbarActions"
        :key="action.name"
        :variant="action.isActive() ? 'solid' : 'outline'"
        size="sm"
        :icon="action.icon"
        @click="action.command"
        :disabled="!action.canRun()"
      >
        {{ action.label }}
      </UButton>
      
      <!-- Image Upload Button -->
      <UButton
        variant="outline"
        size="sm"
        icon="i-heroicons-photo"
        @click="triggerImageUpload"
      >
        Image
      </UButton>
      
      <!-- Link Button -->
      <UButton
        variant="outline"
        size="sm"
        icon="i-heroicons-link"
        @click="addLink"
      >
        Link
      </UButton>
    </div>

    <!-- Editor Content -->
    <div class="editor-container mb-4">
      <div v-if="!previewMode" ref="editorRef" class="editor-content"></div>
      <div v-else class="preview-content" v-html="renderedContent"></div>
    </div>

    <!-- Character Counter -->
    <div class="character-count" :class="{ 'warning': characterCount > contentMaxLength * 0.8, 'error': characterCount >= contentMaxLength }">
      {{ characterCount }}/{{ contentMaxLength }} characters
    </div>

    <!-- Image Upload Input -->
    <input
      ref="imageInput"
      type="file"
      accept="image/*"
      multiple
      class="hidden"
      @change="handleImageUpload"
    />

    <!-- Action Buttons -->
    <div class="flex justify-between mt-6">
      <UButton variant="outline" @click="saveDraft">
        Save Draft
      </UButton>
      <div class="flex gap-3">
        <UButton variant="outline" @click="resetEditor">
          Reset
        </UButton>
        <UButton 
          variant="solid" 
          @click="publishPost"
          :disabled="!canPublish"
          :loading="isPublishing"
        >
          Publish Post
        </UButton>
      </div>
    </div>

    <!-- Link Modal -->
    <UModal v-model="linkModalOpen">
      <UCard>
        <template #header>
          <h3 class="text-lg font-medium">Add Link</h3>
        </template>
        
        <div class="space-y-4">
          <UInput
            v-model="linkUrl"
            placeholder="Enter URL..."
            label="URL"
          />
          <UInput
            v-model="linkText"
            placeholder="Enter link text..."
            label="Link Text"
          />
          <div v-if="linkPreview" class="p-3 border rounded-lg">
            <h4 class="font-medium">{{ linkPreview.title }}</h4>
            <p class="text-sm text-gray-600">{{ linkPreview.description }}</p>
            <img v-if="linkPreview.image" :src="linkPreview.image" alt="Preview" class="mt-2 max-w-full h-32 object-cover rounded" />
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="outline" @click="linkModalOpen = false">
              Cancel
            </UButton>
            <UButton @click="insertLink">
              Insert Link
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { marked } from 'marked'

interface Post {
  title: string
  content: string
  images: string[]
}

interface LinkPreview {
  title: string
  description: string
  image?: string
}

// Reactive data
const post = ref<Post>({
  title: '',
  content: '',
  images: []
})

const previewMode = ref(false)
const editor = ref<Editor | null>(null)
const editorRef = ref<HTMLElement>()
const imageInput = ref<HTMLInputElement>()
const linkModalOpen = ref(false)
const linkUrl = ref('')
const linkText = ref('')
const linkPreview = ref<LinkPreview | null>(null)

const autoSaveStatus = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')
const autoSaveMessage = computed(() => {
  switch (autoSaveStatus.value) {
    case 'saving': return 'Saving...'
    case 'saved': return 'Saved'
    case 'error': return 'Save failed'
    default: return ''
  }
})

const isPublishing = ref(false)
const characterCount = ref(0)
const titleMaxLength = 300
const contentMaxLength = 10000

// Computed properties
const canPublish = computed(() => {
  return post.value.title.trim().length > 0 && 
         post.value.content.trim().length > 0 && 
         characterCount.value <= contentMaxLength
})

const renderedContent = computed(() => {
  return marked(post.value.content)
})

// Toolbar actions
const toolbarActions = computed(() => [
  {
    name: 'bold',
    label: 'Bold',
    icon: 'i-heroicons-bold',
    command: () => editor.value?.chain().focus().toggleBold().run(),
    canRun: () => editor.value?.can().chain().focus().toggleBold().run() ?? false,
    isActive: () => editor.value?.isActive('bold') ?? false
  },
  {
    name: 'italic',
    label: 'Italic',
    icon: 'i-heroicons-italic',
    command: () => editor.value?.chain().focus().toggleItalic().run(),
    canRun: () => editor.value?.can().chain().focus().toggleItalic().run() ?? false,
    isActive: () => editor.value?.isActive('italic') ?? false
  },
  {
    name: 'heading1',
    label: 'H1',
    icon: 'i-heroicons-h1',
    command: () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run(),
    canRun: () => editor.value?.can().chain().focus().toggleHeading({ level: 1 }).run() ?? false,
    isActive: () => editor.value?.isActive('heading', { level: 1 }) ?? false
  },
  {
    name: 'heading2',
    label: 'H2',
    icon: 'i-heroicons-h2',
    command: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run(),
    canRun: () => editor.value?.can().chain().focus().toggleHeading({ level: 2 }).run() ?? false,
    isActive: () => editor.value?.isActive('heading', { level: 2 }) ?? false
  },
  {
    name: 'bulletList',
    label: 'List',
    icon: 'i-heroicons-list-bullet',
    command: () => editor.value?.chain().focus().toggleBulletList().run(),
    canRun: () => editor.value?.can().chain().focus().toggleBulletList().run() ?? false,
    isActive: () => editor.value?.isActive('bulletList') ?? false
  },
  {
    name: 'orderedList',
    label: 'Numbered',
    icon: 'i-heroicons-numbered-list',
    command: () => editor.value?.chain().focus().toggleOrderedList().run(),
    canRun: () => editor.value?.can().chain().focus().toggleOrderedList().run() ?? false,
    isActive: () => editor.value?.isActive('orderedList') ?? false
  },
  {
    name: 'blockquote',
    label: 'Quote',
    icon: 'i-heroicons-chat-bubble-left-right',
    command: () => editor.value?.chain().focus().toggleBlockquote().run(),
    canRun: () => editor.value?.can().chain().focus().toggleBlockquote().run() ?? false,
    isActive: () => editor.value?.isActive('blockquote') ?? false
  },
  {
    name: 'code',
    label: 'Code',
    icon: 'i-heroicons-code-bracket',
    command: () => editor.value?.chain().focus().toggleCode().run(),
    canRun: () => editor.value?.can().chain().focus().toggleCode().run() ?? false,
    isActive: () => editor.value?.isActive('code') ?? false
  }
])

// Editor initialization
onMounted(() => {
  initializeEditor()
  loadDraft()
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

function initializeEditor() {
  if (!editorRef.value) return

  editor.value = new Editor({
    element: editorRef.value,
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your post...',
      }),
      CharacterCount.configure({
        limit: contentMaxLength,
      }),
    ],
    content: post.value.content,
    onUpdate: ({ editor }) => {
      post.value.content = editor.getHTML()
      characterCount.value = editor.storage.characterCount.characters()
      debouncedAutoSave()
    },
  })
}

// Auto-save functionality
const autoSaveTimeout = ref<NodeJS.Timeout>()

const debouncedAutoSave = () => {
  if (autoSaveTimeout.value) {
    clearTimeout(autoSaveTimeout.value)
  }
  
  autoSaveTimeout.value = setTimeout(() => {
    autoSave()
  }, 2000) // Auto-save after 2 seconds of inactivity
}

async function autoSave() {
  if (!post.value.title && !post.value.content) return
  
  autoSaveStatus.value = 'saving'
  
  try {
    // Save draft to localStorage for now
    // In a real app, this would save to Appwrite or another backend
    const draft = {
      ...post.value,
      timestamp: Date.now()
    }
    localStorage.setItem('post-draft', JSON.stringify(draft))
    
    autoSaveStatus.value = 'saved'
    setTimeout(() => {
      autoSaveStatus.value = 'idle'
    }, 2000)
  } catch (error) {
    console.error('Auto-save failed:', error)
    autoSaveStatus.value = 'error'
    setTimeout(() => {
      autoSaveStatus.value = 'idle'
    }, 3000)
  }
}

function loadDraft() {
  try {
    const draft = localStorage.getItem('post-draft')
    if (draft) {
      const parsedDraft = JSON.parse(draft)
      post.value = {
        title: parsedDraft.title || '',
        content: parsedDraft.content || '',
        images: parsedDraft.images || []
      }
      
      // Update editor content
      if (editor.value) {
        editor.value.commands.setContent(post.value.content)
      }
    }
  } catch (error) {
    console.error('Failed to load draft:', error)
  }
}

// Image upload functionality
function triggerImageUpload() {
  imageInput.value?.click()
}

async function handleImageUpload(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files) return

  for (const file of Array.from(files)) {
    if (file.type.startsWith('image/')) {
      await uploadImage(file)
    }
  }
}

async function uploadImage(file: File) {
  try {
    // For now, create a local object URL
    // In production, this would upload to Appwrite Storage
    const imageUrl = URL.createObjectURL(file)
    
    // Insert image into editor
    editor.value?.chain().focus().setImage({ src: imageUrl }).run()
    
    post.value.images.push(imageUrl)
  } catch (error) {
    console.error('Image upload failed:', error)
    // Show error notification
  }
}

// Link functionality
function addLink() {
  const selectedText = editor.value?.state.doc.textBetween(
    editor.value.state.selection.from,
    editor.value.state.selection.to
  )
  
  linkText.value = selectedText || ''
  linkUrl.value = ''
  linkPreview.value = null
  linkModalOpen.value = true
}

async function insertLink() {
  if (!linkUrl.value) return
  
  const url = linkUrl.value.startsWith('http') ? linkUrl.value : `https://${linkUrl.value}`
  const text = linkText.value || url
  
  editor.value?.chain().focus()
    .insertContent(`<a href="${url}">${text}</a>`)
    .run()
  
  linkModalOpen.value = false
  linkUrl.value = ''
  linkText.value = ''
  linkPreview.value = null
}

// Watch for link URL changes to generate preview
watch(linkUrl, async (newUrl) => {
  if (newUrl && newUrl.length > 10) {
    // In production, this would call a link preview API
    linkPreview.value = {
      title: 'Link Preview',
      description: 'Preview description would appear here',
      image: undefined
    }
  }
})

// Title change handler
function handleTitleChange() {
  debouncedAutoSave()
}

// Editor actions
function togglePreview() {
  previewMode.value = !previewMode.value
}

function saveDraft() {
  autoSave()
}

function resetEditor() {
  post.value = {
    title: '',
    content: '',
    images: []
  }
  editor.value?.commands.clearContent()
  localStorage.removeItem('post-draft')
}

async function publishPost() {
  if (!canPublish.value) return
  
  isPublishing.value = true
  
  try {
    // In production, this would save to Appwrite database
    console.log('Publishing post:', post.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Clear draft after successful publish
    localStorage.removeItem('post-draft')
    
    // Navigate to post or show success message
    // await navigateTo(`/posts/${postId}`)
    
  } catch (error) {
    console.error('Failed to publish post:', error)
  } finally {
    isPublishing.value = false
  }
}
</script>