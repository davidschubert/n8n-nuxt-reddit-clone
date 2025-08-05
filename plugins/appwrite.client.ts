// Appwrite Client Plugin für Nuxt
export default defineNuxtPlugin(async () => {
  // Auth Composable für globale Verfügbarkeit
  const { init } = useAuth()

  // Nur im Client ausführen
  if (process.client) {
    try {
      // Authentifizierung beim App-Start initialisieren
      await init()
      console.log('🔐 Appwrite Authentication initialisiert')
    } catch (error) {
      console.warn('⚠️  Appwrite Authentication konnte nicht initialisiert werden:', error)
    }
  }
})
