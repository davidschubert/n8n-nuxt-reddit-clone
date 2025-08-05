<template>
  <div class="home-page">
    <div class="container">
      <div class="hero">
        <h1>Welcome to Reddit Clone</h1>
        <p>Explore user profiles and their activities</p>
      </div>
      
      <div class="user-grid">
        <h2>Sample Users</h2>
        <div class="users">
          <NuxtLink 
            v-for="user in sampleUsers" 
            :key="user.username"
            :to="`/user/${user.username}`"
            class="user-card"
          >
            <img :src="user.avatar" :alt="user.username" class="user-avatar">
            <div class="user-info">
              <h3>{{ user.username }}</h3>
              <p>{{ user.karma }} karma</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Reddit Clone - Home',
  meta: [
    { name: 'description', content: 'A Reddit clone built with Nuxt.js showcasing user profiles and activities.' }
  ]
})

const sampleUsers = [
  {
    username: 'john_doe',
    avatar: 'https://i.pravatar.cc/150?u=john_doe',
    karma: 2847
  },
  {
    username: 'jane_smith',
    avatar: 'https://i.pravatar.cc/150?u=jane_smith',
    karma: 1523
  },
  {
    username: 'tech_guru',
    avatar: 'https://i.pravatar.cc/150?u=tech_guru',
    karma: 5420
  }
]
</script>

<style scoped>
.home-page {
  min-height: calc(100vh - 100px);
  padding: 40px 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
}

.hero {
  text-align: center;
  margin-bottom: 60px;
}

.hero h1 {
  font-size: 36px;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.hero p {
  font-size: 18px;
  color: #6b7280;
  margin: 0;
}

.user-grid h2 {
  font-size: 24px;
  color: #1f2937;
  margin: 0 0 24px 0;
  text-align: center;
}

.users {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.user-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info h3 {
  font-size: 18px;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.user-info p {
  color: #6b7280;
  margin: 0;
  font-size: 14px;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 28px;
  }
  
  .users {
    grid-template-columns: 1fr;
  }
  
  .user-card {
    padding: 20px;
  }
}
</style>