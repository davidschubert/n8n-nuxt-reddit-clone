<template>
  <div class="container">
    <h1>Create New Post</h1>
    
    <div v-if="successMessage" class="success">
      {{ successMessage }}
      <NuxtLink to="/">Go back to posts</NuxtLink>
    </div>

    <form @submit.prevent="createPost" v-if="!successMessage">
      <div class="form-group">
        <label for="title" class="form-label">Title *</label>
        <input 
          id="title"
          v-model="form.title" 
          type="text" 
          class="form-input"
          placeholder="Enter post title"
          required
        />
        <div v-if="getFieldError('title')" class="error">
          {{ getFieldError('title') }}
        </div>
      </div>

      <div class="form-group">
        <label for="content" class="form-label">Content *</label>
        <textarea 
          id="content"
          v-model="form.content" 
          class="form-textarea"
          placeholder="Enter post content"
          required
        ></textarea>
        <div v-if="getFieldError('content')" class="error">
          {{ getFieldError('content') }}
        </div>
      </div>

      <div class="form-group">
        <label for="tags" class="form-label">Tags (comma-separated)</label>
        <input 
          id="tags"
          v-model="tagsInput" 
          type="text" 
          class="form-input"
          placeholder="e.g. technology, programming, web"
        />
        <div v-if="getFieldError('tags')" class="error">
          {{ getFieldError('tags') }}
        </div>
      </div>

      <div class="form-group">
        <label>
          <input 
            v-model="form.isPublished" 
            type="checkbox"
          />
          Publish immediately
        </label>
      </div>

      <div v-if="generalError" class="error">
        {{ generalError }}
      </div>

      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Creating...' : 'Create Post' }}
      </button>
      
      <NuxtLink to="/" class="btn" style="margin-left: 10px;">Cancel</NuxtLink>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { CreatePostRequest, ApiResponse, Post, PostValidationError } from '~/types/post'

const form = reactive<CreatePostRequest>({
  title: '',
  content: '',
  tags: [],
  isPublished: true
})

const tagsInput = ref('')
const loading = ref(false)
const generalError = ref('')
const validationErrors = ref<PostValidationError[]>([])
const successMessage = ref('')

watch(tagsInput, (newValue) => {
  form.tags = newValue.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
})

function getFieldError(field: string): string {
  const error = validationErrors.value.find(err => err.field === field)
  return error ? error.message : ''
}

async function createPost() {
  loading.value = true
  generalError.value = ''
  validationErrors.value = []

  try {
    const response = await $fetch<ApiResponse<Post>>('/api/posts', {
      method: 'POST',
      body: form
    })

    if (response.success) {
      successMessage.value = 'Post created successfully!'
      // Reset form
      Object.assign(form, {
        title: '',
        content: '',
        tags: [],
        isPublished: true
      })
      tagsInput.value = ''
    } else {
      if (response.errors) {
        validationErrors.value = response.errors
      } else {
        generalError.value = response.error || 'Failed to create post'
      }
    }
  } catch (err: any) {
    generalError.value = err.message || 'Failed to create post'
  } finally {
    loading.value = false
  }
}
</script>