<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <TheHeader />
    <main class="container mx-auto px-4 py-8 max-w-4xl">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
// Layout is automatically applied to all pages
</script>