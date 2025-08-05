<template>
  <div class="card p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-6">Edit Profile</h2>
    
    <form class="space-y-6" @submit.prevent="handleSubmit">
      <!-- Display Name -->
      <div>
        <label for="displayName" class="block text-sm font-medium text-gray-700 mb-2">
          Display Name
        </label>
        <input
          id="displayName"
          v-model="form.displayName"
          type="text"
          maxlength="50"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Your display name"
        >
        <p class="mt-1 text-sm text-gray-500">
          {{ form.displayName?.length || 0 }}/50 characters
        </p>
      </div>

      <!-- Bio -->
      <div>
        <label for="bio" class="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          id="bio"
          v-model="form.bio"
          rows="4"
          maxlength="500"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Tell us about yourself..."
        />
        <p class="mt-1 text-sm text-gray-500">
          {{ form.bio?.length || 0 }}/500 characters
        </p>
      </div>

      <!-- Location -->
      <div>
        <label for="location" class="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <input
          id="location"
          v-model="form.location"
          type="text"
          maxlength="100"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Your location"
        >
      </div>

      <!-- Website -->
      <div>
        <label for="website" class="block text-sm font-medium text-gray-700 mb-2">
          Website
        </label>
        <input
          id="website"
          v-model="form.website"
          type="url"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://example.com"
        >
        <p v-if="websiteError" class="mt-1 text-sm text-red-600">
          Please enter a valid URL
        </p>
      </div>

      <!-- Privacy Settings -->
      <div class="border-t border-gray-200 pt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
        
        <div class="space-y-4">
          <div class="flex items-center">
            <input
              id="showEmail"
              v-model="form.showEmail"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            >
            <label for="showEmail" class="ml-2 block text-sm text-gray-700">
              Show email address on profile
            </label>
          </div>
          
          <div class="flex items-center">
            <input
              id="allowMessages"
              v-model="form.allowMessages"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            >
            <label for="allowMessages" class="ml-2 block text-sm text-gray-700">
              Allow private messages
            </label>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
        <button
          type="submit"
          :disabled="saving || !isFormValid"
          class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
        
        <button
          type="button"
          :disabled="saving"
          class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleCancel"
        >
          Cancel
        </button>
      </div>
    </form>

    <!-- Error Message -->
    <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
      <div class="flex">
        <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error saving profile</h3>
          <div class="mt-2 text-sm text-red-700">
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['save', 'cancel'])

// Reactive state
const saving = ref(false)
const error = ref('')
const websiteError = ref(false)

const form = reactive({
  displayName: props.profile.displayName || '',
  bio: props.profile.bio || '',
  location: props.profile.location || '',
  website: props.profile.website || '',
  showEmail: props.profile.showEmail || false,
  allowMessages: props.profile.allowMessages || true
})

// Computed properties
const isFormValid = computed(() => {
  return !websiteError.value
})

// Watchers
watch(() => form.website, (newWebsite) => {
  if (newWebsite && newWebsite.trim()) {
    try {
      new URL(newWebsite)
      websiteError.value = false
    } catch {
      websiteError.value = true
    }
  } else {
    websiteError.value = false
  }
})

// Methods
const handleSubmit = async () => {
  if (!isFormValid.value) return

  try {
    saving.value = true
    error.value = ''

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Prepare the data to save
    const updatedData = {
      displayName: form.displayName?.trim() || '',
      bio: form.bio?.trim() || '',
      location: form.location?.trim() || '',
      website: form.website?.trim() || '',
      showEmail: form.showEmail,
      allowMessages: form.allowMessages
    }

    // Emit the save event
    emit('save', updatedData)

  } catch (err) {
    error.value = err.message || 'Failed to save profile. Please try again.'
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  // Reset form to original values
  form.displayName = props.profile.displayName || ''
  form.bio = props.profile.bio || ''
  form.location = props.profile.location || ''
  form.website = props.profile.website || ''
  form.showEmail = props.profile.showEmail || false
  form.allowMessages = props.profile.allowMessages || true
  
  // Clear errors
  error.value = ''
  websiteError.value = false
  
  // Emit cancel event
  emit('cancel')
}

// Reset form when profile prop changes
watch(() => props.profile, (newProfile) => {
  form.displayName = newProfile.displayName || ''
  form.bio = newProfile.bio || ''
  form.location = newProfile.location || ''
  form.website = newProfile.website || ''
  form.showEmail = newProfile.showEmail || false
  form.allowMessages = newProfile.allowMessages || true
}, { immediate: true })
</script>

<style scoped>
/* Component-specific styles */
textarea {
  field-sizing: content;
}
</style>