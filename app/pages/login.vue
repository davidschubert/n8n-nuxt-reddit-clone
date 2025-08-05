<template>
  <div class="max-w-md mx-auto mt-8 px-4">
    <div class="card p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Anmelden</h1>
        <p class="text-gray-600 mt-2">Willkommen zurück bei Reddit Clone</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            E-Mail
          </label>
          <input 
            v-model="form.email"
            type="email" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ihre@email.com"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Passwort
          </label>
          <input 
            v-model="form.password"
            type="password" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          >
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full btn-primary disabled:opacity-50"
        >
          {{ isLoading ? 'Anmelden...' : 'Anmelden' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Noch kein Konto? 
          <NuxtLink to="/register" class="text-blue-600 hover:text-blue-800 font-medium">
            Hier registrieren
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login, isLoading } = useAuth()
const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  try {
    await login(form.value.email, form.value.password)
    await router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
    // In a real app, show error message to user
  }
}

// SEO
useHead({
  title: 'Anmelden - Reddit Clone',
  meta: [
    { name: 'description', content: 'Melden Sie sich bei Reddit Clone an' }
  ]
})
</script>