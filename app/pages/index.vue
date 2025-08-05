<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2">
        <div class="card p-6 mb-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-4">
            Willkommen bei Reddit Clone
          </h1>
          <p class="text-gray-600 mb-4">
            Entdecken Sie interessante Diskussionen und teilen Sie Ihre Gedanken mit der Community.
          </p>
          
          <div v-if="!isLoggedIn" class="flex space-x-4">
            <NuxtLink to="/register" class="btn-primary">
              Jetzt Registrieren
            </NuxtLink>
            <NuxtLink to="/login" class="btn-secondary">
              Anmelden
            </NuxtLink>
          </div>
          
          <div v-else class="flex space-x-4">
            <NuxtLink to="/submit" class="btn-primary">
              Beitrag Erstellen
            </NuxtLink>
            <NuxtLink :to="`/user/${user?.name || user?.$id}`" class="btn-secondary">
              Mein Profil
            </NuxtLink>
          </div>
        </div>

        <!-- Posts Section -->
        <div class="space-y-4">
          <h2 class="text-xl font-semibold text-gray-900">Neueste Beiträge</h2>
          
          <!-- Sample Posts -->
          <article class="card p-6">
            <div class="flex items-start space-x-4">
              <div class="flex flex-col items-center">
                <button class="text-gray-400 hover:text-orange-500 transition-colors">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
                <span class="text-sm font-medium text-gray-700 my-1">42</span>
                <button class="text-gray-400 hover:text-blue-500 transition-colors">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                  Willkommen bei unserem neuen Reddit Clone!
                </h3>
                <p class="text-gray-600 mt-2 line-clamp-3">
                  Wir freuen uns, unsere neue Plattform für Diskussionen und Community-Interaktion zu präsentieren. 
                  Diese Anwendung wurde mit Nuxt.js und Appwrite entwickelt und bietet alle Funktionen, 
                  die Sie von einem modernen Forum erwarten.
                </p>
                
                <div class="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                  <span>von <span class="font-medium hover:text-blue-600 cursor-pointer">Admin</span></span>
                  <span>vor 2 Stunden</span>
                  <button class="hover:text-gray-700 transition-colors flex items-center space-x-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
                    </svg>
                    <span>15 Kommentare</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <div class="card p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Community Info</h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Mitglieder:</span>
              <span class="font-medium">1,234</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Online:</span>
              <span class="font-medium">89</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Beiträge heute:</span>
              <span class="font-medium">23</span>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Beliebte Themen</h3>
          <div class="space-y-2">
            <a href="#" class="block text-blue-600 hover:text-blue-800 text-sm font-medium">
              #webentwicklung
            </a>
            <a href="#" class="block text-blue-600 hover:text-blue-800 text-sm font-medium">
              #vue.js
            </a>
            <a href="#" class="block text-blue-600 hover:text-blue-800 text-sm font-medium">
              #nuxt.js
            </a>
            <a href="#" class="block text-blue-600 hover:text-blue-800 text-sm font-medium">
              #appwrite
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, isLoggedIn } = useAuth()

// SEO Meta Tags
useHead({
  title: 'Reddit Clone - Community Diskussionen',
  meta: [
    { name: 'description', content: 'Entdecken Sie interessante Diskussionen und teilen Sie Ihre Gedanken mit unserer Community.' }
  ]
})
</script>