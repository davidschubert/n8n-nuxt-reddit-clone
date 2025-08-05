<template>
  <div class="home-page">
    <div class="container">
      <div class="hero">
        <h1 class="hero__title">Reddit Clone</h1>
        <p class="hero__subtitle">
          Ein einfacher Reddit Clone mit Kommentar-Sortierung
        </p>
        
        <div class="demo-section">
          <h2>Demo: Kommentar-Sortierung</h2>
          <p>
            Teste die verschiedenen Sortierungsoptionen für Kommentare:
          </p>
          <ul class="features-list">
            <li><strong>Beliebt</strong> - Kommentare mit den höchsten Scores zuerst</li>
            <li><strong>Neu</strong> - Neueste Kommentare zuerst</li>
            <li><strong>Älteste</strong> - Älteste Kommentare zuerst</li>
            <li><strong>Kontrovers</strong> - Kommentare mit vielen Up- und Downvotes</li>
          </ul>
          
          <NuxtLink to="/posts/1" class="demo-button">
            Zum Demo-Post mit Kommentaren
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Reddit Clone - Kommentar Sortierung Demo',
  description: 'Ein Reddit Clone mit erweiterten Kommentar-Sortierungsoptionen',
  ogTitle: 'Reddit Clone - Kommentar Sortierung Demo',
  ogDescription: 'Teste verschiedene Sortierungsoptionen für Kommentare: Beliebt, Neu, Alt, Kontrovers'
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero {
  background-color: white;
  border-radius: 1rem;
  padding: 3rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  text-align: center;
}

.hero__title {
  font-size: 3rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.hero__subtitle {
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 2rem;
}

.demo-section {
  text-align: left;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.demo-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.demo-section p {
  color: #374151;
  margin-bottom: 1rem;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
}

.features-list li {
  padding: 0.5rem 0;
  color: #374151;
}

.features-list strong {
  color: #1f2937;
}

.demo-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  transition: all 0.2s ease-in-out;
  margin-top: 1rem;
}

.demo-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Responsive design */
@media (max-width: 640px) {
  .hero {
    padding: 2rem;
  }
  
  .hero__title {
    font-size: 2rem;
  }
  
  .hero__subtitle {
    font-size: 1rem;
  }
}
</style>