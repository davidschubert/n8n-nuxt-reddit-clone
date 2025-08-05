<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Welcome to Reddit Clone</h1>
    
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div class="card p-6">
        <h2 class="text-xl font-semibold mb-4">Featured Posts</h2>
        <p class="text-gray-600">Discover the most popular posts in the community.</p>
      </div>
      
      <div class="card p-6">
        <h2 class="text-xl font-semibold mb-4">Communities</h2>
        <p class="text-gray-600">Join communities and connect with like-minded people.</p>
      </div>
      
      <div class="card p-6">
        <h2 class="text-xl font-semibold mb-4">Your Profile</h2>
        <p class="text-gray-600 mb-4">Manage your profile and view your activity.</p>
        <NuxtLink to="/profile/testuser" class="btn-primary">
          View Profile
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// Home page
useSeoMeta({
  title: 'Home - Reddit Clone',
  description: 'A Reddit clone built with Nuxt.js'
})
</script>