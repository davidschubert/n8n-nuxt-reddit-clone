<template>
  <div class="post-editor p-6">
    <h2 class="text-2xl font-bold mb-4">Create Post</h2>
    
    <!-- Title Input -->
    <div class="mb-4">
      <UInput
        v-model="title"
        placeholder="Enter post title..."
        size="lg"
        class="mb-2"
      />
      <div class="text-sm text-gray-500">{{ title.length }}/300 characters</div>
    </div>

    <!-- Simple Editor -->
    <div class="mb-4">
      <UTextarea
        v-model="content"
        placeholder="Write your post content here..."
        :rows="10"
        class="mb-2"
      />
      <div class="text-sm text-gray-500">{{ content.length }}/10000 characters</div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-between">
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
        >
          Publish Post
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
// Reactive data
const title = ref('')
const content = ref('')

// Computed properties
const canPublish = computed(() => {
  return title.value.trim().length > 0 && content.value.trim().length > 0
})

// Functions
function saveDraft() {
  const draft = {
    title: title.value,
    content: content.value,
    timestamp: Date.now()
  }
  localStorage.setItem('post-draft', JSON.stringify(draft))
  console.log('Draft saved')
}

function resetEditor() {
  title.value = ''
  content.value = ''
  localStorage.removeItem('post-draft')
}

function publishPost() {
  console.log('Publishing post:', { title: title.value, content: content.value })
}

// Load draft on mount
onMounted(() => {
  try {
    const draft = localStorage.getItem('post-draft')
    if (draft) {
      const parsedDraft = JSON.parse(draft)
      title.value = parsedDraft.title || ''
      content.value = parsedDraft.content || ''
    }
  } catch (error) {
    console.error('Failed to load draft:', error)
  }
})
</script>