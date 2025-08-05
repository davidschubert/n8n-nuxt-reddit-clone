<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Skip to main content link for accessibility -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-md"
    >
      Skip to main content
    </a>

    <!-- Header -->
    <header
      class="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm"
      role="banner"
    >
      <nav
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        role="navigation"
        aria-label="Main navigation"
      >
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink
              to="/"
              class="flex items-center space-x-2 text-xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              aria-label="N8N Reddit Clone - Home"
            >
              <span class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">N</span>
              <span>N8N Reddit</span>
            </NuxtLink>
          </div>

          <!-- Search -->
          <div class="flex-1 max-w-lg mx-8">
            <div class="relative">
              <label for="search" class="sr-only">Search posts</label>
              <input
                id="search"
                type="search"
                placeholder="Search posts..."
                class="input pr-10"
                aria-describedby="search-description"
              >
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span class="text-gray-400">🔍</span>
              </div>
              <div id="search-description" class="sr-only">
                Search through all posts and comments
              </div>
            </div>
          </div>

          <!-- User actions -->
          <div class="flex items-center space-x-4">
            <!-- Theme toggle -->
            <button
              class="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              @click="toggleColorMode"
              aria-label="Toggle theme"
            >
              <span class="text-lg">🌙</span>
            </button>

            <!-- Create post button -->
            <button class="btn btn-primary">
              <span class="mr-2">+</span>
              Create Post
            </button>

            <!-- User menu -->
            <div class="relative">
              <button
                class="flex items-center space-x-2 p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                aria-label="User menu"
              >
                <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium">U</span>
                </div>
                <span>▼</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main content -->
    <main
      id="main-content"
      class="flex-1"
      role="main"
      tabindex="-1"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer
      class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto"
      role="contentinfo"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- About -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              About
            </h3>
            <ul class="mt-4 space-y-2">
              <li>
                <NuxtLink
                  to="/about"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  About Us
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/privacy"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Privacy Policy
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/terms"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Terms of Service
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Community -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Community
            </h3>
            <ul class="mt-4 space-y-2">
              <li>
                <NuxtLink
                  to="/guidelines"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Community Guidelines
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/help"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Help Center
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Support
            </h3>
            <ul class="mt-4 space-y-2">
              <li>
                <NuxtLink
                  to="/contact"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Contact Us
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/feedback"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Feedback
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Accessibility -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Accessibility
            </h3>
            <ul class="mt-4 space-y-2">
              <li>
                <NuxtLink
                  to="/accessibility"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Accessibility Statement
                </NuxtLink>
              </li>
              <li>
                <button
                  type="button"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  @click="toggleHighContrast"
                >
                  High Contrast Mode
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Copyright -->
        <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-600 dark:text-gray-400 text-center">
            © {{ new Date().getFullYear() }} N8N Nuxt Reddit Clone. Built with accessibility in mind.
          </p>
        </div>
      </div>
    </footer>

    <!-- Global components -->
    <LoadingOverlay />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const userMenuItems = [
  [
    {
      label: 'Profile',
      icon: 'i-heroicons-user',
      to: '/profile'
    },
    {
      label: 'Settings',
      icon: 'i-heroicons-cog-6-tooth',
      to: '/settings'
    }
  ],
  [
    {
      label: 'Sign Out',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: () => {
        // Handle sign out
      }
    }
  ]
]

const toggleColorMode = () => {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}

const toggleHighContrast = () => {
  document.documentElement.classList.toggle('high-contrast')
}

// SEO head management
useHead({
  bodyAttrs: {
    class: 'antialiased'
  }
})
</script>