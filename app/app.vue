<template>
  <div class="app">
    <NuxtRouteAnnouncer />
    
    <header class="app-header">
      <div class="header-container">
        <NuxtLink to="/" class="logo">
          <h1>Reddit Clone</h1>
        </NuxtLink>
        
        <nav class="nav">
          <NuxtLink to="/user/john_doe" class="nav-link">John Doe</NuxtLink>
          <NuxtLink to="/user/jane_smith" class="nav-link">Jane Smith</NuxtLink>
          <NuxtLink to="/user/tech_guru" class="nav-link">Tech Guru</NuxtLink>
        </nav>
      </div>
    </header>
    
    <main class="main-content">
      <NuxtPage />
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f8fafc;
}

.app {
  min-height: 100vh;
}

.app-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  margin: 0;
  color: #1f2937;
  font-size: 24px;
  font-weight: bold;
}

.logo {
  text-decoration: none;
}

.nav {
  display: flex;
  gap: 24px;
}

.nav-link {
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #3b82f6;
}

.nav-link.router-link-active {
  color: #3b82f6;
}

.main-content {
  flex: 1;
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 16px;
  }
  
  .nav {
    gap: 16px;
  }
}
</style>
