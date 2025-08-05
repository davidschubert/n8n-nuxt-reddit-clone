<template>
  <div class="page">
    <ConnectionStatus />
    
    <header class="header">
      <h1>Nuxt Reddit Clone - Realtime Comments Demo</h1>
      <p>Experience live comments with Appwrite realtime subscriptions</p>
    </header>

    <main class="main">
      <!-- Mock Post -->
      <article class="post">
        <div class="post-header">
          <h2>Sample Reddit Post</h2>
          <div class="post-meta">
            <span>Posted by u/demo_user • 2 hours ago</span>
          </div>
        </div>
        
        <div class="post-content">
          <p>
            This is a sample Reddit post to demonstrate the realtime comments feature. 
            The comments below will update in real-time using Appwrite's realtime subscriptions.
          </p>
          
          <div class="features-list">
            <h3>Realtime Features Demonstrated:</h3>
            <ul>
              <li>✅ Live new comments without page refresh</li>
              <li>✅ Real-time vote score updates</li>
              <li>✅ Connection status indicator</li>
              <li>✅ Offline queue for actions</li>
              <li>✅ Smart reconnection with exponential backoff</li>
              <li>✅ Reply notifications</li>
              <li>✅ Performance optimized with batched updates</li>
              <li>✅ Error handling and recovery</li>
            </ul>
          </div>
        </div>
      </article>

      <!-- Comments Section -->
      <Comments :post-id="demoPostId" />
    </main>
  </div>
</template>

<script setup lang="ts">
// Use a fixed demo post ID for this example
const demoPostId = 'demo-post-123'

// Set page title
useHead({
  title: 'Realtime Comments Demo - Reddit Clone'
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f8fafc;
}

.header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 20px 0;
  text-align: center;
}

.header h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  color: #1a202c;
}

.header p {
  margin: 0;
  color: #718096;
  font-size: 16px;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.post {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.post-header {
  margin-bottom: 16px;
}

.post-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
}

.post-meta {
  color: #718096;
  font-size: 14px;
}

.post-content {
  line-height: 1.6;
  color: #2d3748;
}

.post-content p {
  margin-bottom: 20px;
}

.features-list {
  background: #f7fafc;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.features-list h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
}

.features-list ul {
  margin: 0;
  padding-left: 20px;
}

.features-list li {
  margin-bottom: 8px;
  color: #4a5568;
}
</style>