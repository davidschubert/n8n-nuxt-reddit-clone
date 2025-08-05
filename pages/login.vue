<template>
  <div class="max-w-md mx-auto">
    <div class="card p-8">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Welcome to Reddit Clone</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Join the community and start sharing!</p>
      </div>
      
      <UForm :schema="loginSchema" :state="state" @submit="handleLogin" class="space-y-4">
        <UFormGroup label="Email" name="email">
          <UInput 
            v-model="state.email" 
            type="email" 
            placeholder="Enter your email"
            icon="i-heroicons-envelope"
          />
        </UFormGroup>
        
        <UFormGroup label="Password" name="password">
          <UInput 
            v-model="state.password" 
            type="password" 
            placeholder="Enter your password"
            icon="i-heroicons-lock-closed"
          />
        </UFormGroup>
        
        <UButton 
          type="submit" 
          block 
          :loading="authStore.loading"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Logging in...' : 'Login' }}
        </UButton>
      </UForm>
      
      <div class="mt-6 text-center">
        <p class="text-gray-600 dark:text-gray-400">
          Don't have an account? 
          <NuxtLink to="/register" class="text-blue-600 hover:text-blue-700 font-medium">
            Sign up
          </NuxtLink>
        </p>
      </div>
      
      <!-- Error message -->
      <UAlert 
        v-if="error" 
        color="red" 
        variant="soft" 
        :title="error"
        class="mt-4"
      />
    </div>
  </div>
</template>

<script setup>
import { z } from 'zod'

definePageMeta({
  middleware: 'guest',
  layout: 'default'
})

const authStore = useAuthStore()
const router = useRouter()

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

const state = reactive({
  email: '',
  password: ''
})

const error = ref('')

async function handleLogin() {
  error.value = ''
  
  try {
    const result = await authStore.login(state.email, state.password)
    
    if (result.success) {
      await router.push('/')
    } else {
      error.value = result.error || 'Login failed'
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    console.error('Login error:', err)
  }
}
</script>