<template>
  <div class="container">
    <header class="app-header">
      <h1>Reddit Clone</h1>
      <nav>
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/post/demo-post">Demo Post</NuxtLink>
      </nav>
    </header>
    
    <main class="main-content">
      <div class="posts-grid">
        <article class="post-card">
          <h2>
            <NuxtLink to="/post/demo-post">
              Welcome to SSR Comments Demo
            </NuxtLink>
          </h2>
          <p>This is a demonstration of server-side rendered nested comments in a Nuxt.js Reddit clone.</p>
          <div class="post-meta">
            <span>Posted 2 hours ago</span>
            <NuxtLink to="/post/demo-post">View Comments</NuxtLink>
          </div>
        </article>
        
        <article class="post-card">
          <h2>
            <NuxtLink to="/post/performance-demo">
              Performance Test Post
            </NuxtLink>
          </h2>
          <p>A post designed to test comment loading performance with many nested replies.</p>
          <div class="post-meta">
            <span>Posted 5 hours ago</span>
            <NuxtLink to="/post/performance-demo">View Comments</NuxtLink>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<script setup>
// SEO and meta tags
useHead({
  title: 'Home - Reddit Clone',
  meta: [
    { 
      name: 'description', 
      content: 'A Reddit clone with server-side rendered comments for optimal performance and SEO' 
    },
    { property: 'og:title', content: 'Reddit Clone - SSR Comments Demo' },
    { property: 'og:description', content: 'Experience fast-loading, SEO-optimized comment threads' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>

<style scoped>
.app-header {
  background: white;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 24px;
}

.app-header h1 {
  margin: 0 0 12px 0;
  color: #ff4500;
  font-size: 24px;
}

.app-header nav {
  display: flex;
  gap: 20px;
}

.app-header nav a {
  color: #0079d3;
  text-decoration: none;
  font-weight: 500;
}

.app-header nav a:hover {
  text-decoration: underline;
}

.posts-grid {
  display: grid;
  gap: 16px;
}

.post-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #eee;
}

.post-card h2 {
  margin: 0 0 12px 0;
  font-size: 18px;
}

.post-card h2 a {
  color: #1a1a1b;
  text-decoration: none;
}

.post-card h2 a:hover {
  color: #0079d3;
}

.post-card p {
  margin: 0 0 16px 0;
  line-height: 1.5;
  color: #666;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #878a8c;
}

.post-meta a {
  color: #0079d3;
  text-decoration: none;
  font-weight: 500;
}

.post-meta a:hover {
  text-decoration: underline;
}
</style>