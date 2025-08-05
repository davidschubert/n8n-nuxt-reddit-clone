<template>
  <div class="max-w-md mx-auto">
    <div class="card p-8">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Join our community today!</p>
      </div>
      
      <UForm :schema="registerSchema" :state="state" @submit="handleRegister" class="space-y-4">
        <UFormGroup label="Name" name="name">
          <UInput 
            v-model="state.name" 
            placeholder="Enter your full name"
            icon="i-heroicons-user"
          />
        </UFormGroup>
        
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
        
        <UFormGroup label="Confirm Password" name="confirmPassword">
          <UInput 
            v-model="state.confirmPassword" 
            type="password" 
            placeholder="Confirm your password"
            icon="i-heroicons-lock-closed"
          />
        </UFormGroup>
        
        <UButton 
          type="submit" 
          block 
          :loading="authStore.loading"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Creating Account...' : 'Create Account' }}
        </UButton>
      </UForm>
      
      <div class="mt-6 text-center">
        <p class="text-gray-600 dark:text-gray-400">
          Already have an account? 
          <NuxtLink to="/login" class="text-blue-600 hover:text-blue-700 font-medium">
            Login
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

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

const state = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const error = ref('')

async function handleRegister() {
  error.value = ''
  
  try {
    const result = await authStore.register(state.email, state.password, state.name)
    
    if (result.success) {
      await router.push('/')
    } else {
      error.value = result.error || 'Registration failed'
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    console.error('Registration error:', err)
  }
}
</script>