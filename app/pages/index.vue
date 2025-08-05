<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Demo Post -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div class="p-6">
            <h1 class="text-2xl font-bold text-gray-900 mb-4">
              Reddit Clone - Kommentarsystem Demo
            </h1>
            <p class="text-gray-700 mb-4">
              Dies ist eine Demo des vollständig funktionsfähigen Kommentarsystems für unseren Reddit Clone.
              Das System unterstützt:
            </p>
            <ul class="list-disc list-inside text-gray-700 space-y-1 mb-4">
              <li>Verschachtelte Kommentare (Thread-Struktur)</li>
              <li>Upvote/Downvote Mechanismus</li>
              <li>Verschiedene Sortieroptionen (Beliebt, Neu, Älteste)</li>
              <li>Echtzeitfähiges Interface</li>
              <li>SSR-kompatible Darstellung</li>
            </ul>
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <span>Von: Demo User</span>
              <span>•</span>
              <span>vor 2 Stunden</span>
              <span>•</span>
              <span class="text-blue-600">r/webdev</span>
            </div>
          </div>
        </div>

        <!-- Configuration Panel -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h2 class="text-lg font-semibold text-blue-900 mb-2">Konfiguration</h2>
          <p class="text-blue-800 text-sm mb-3">
            Für eine vollständige Funktionalität müssen die folgenden Umgebungsvariablen gesetzt werden:
          </p>
          <div class="bg-white rounded border p-3 text-sm font-mono text-gray-700">
            <div>APPWRITE_ENDPOINT={{ config.public.appwriteEndpoint }}</div>
            <div>APPWRITE_PROJECT_ID={{ config.public.appwriteProjectId || '(nicht gesetzt)' }}</div>
            <div>APPWRITE_DATABASE_ID={{ config.public.appwriteDatabaseId || '(nicht gesetzt)' }}</div>
            <div>APPWRITE_COMMENTS_COLLECTION_ID={{ config.public.appwriteCommentsCollectionId || '(nicht gesetzt)' }}</div>
            <div>APPWRITE_VOTES_COLLECTION_ID={{ config.public.appwriteVotesCollectionId || '(nicht gesetzt)' }}</div>
          </div>
          <p class="text-blue-700 text-xs mt-2">
            Ohne korrekte Konfiguration wird das System im Demo-Modus mit Mock-Daten laufen.
          </p>
        </div>

        <!-- Comment System -->
        <CommentSection
          :post-id="demoPostId"
          :current-user-id="currentUserId"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

// Demo data
const demoPostId = 'demo-post-123'
const currentUserId = 'user-123'

// Set page title
useHead({
  title: 'Kommentarsystem Demo - Reddit Clone',
  meta: [
    { name: 'description', content: 'Demo des vollständigen Kommentarsystems für den Reddit Clone mit verschachtelten Kommentaren und Voting-System.' }
  ]
})
</script>