// stores/app.ts
export const useAppStore = defineStore('app', () => {
  const isReady = ref(false)
  const techStack = ref([
    'Nuxt 4',
    'Tailwind CSS v4', 
    'Nuxt UI',
    'Reka UI',
    'TypeScript',
    'Pinia'
  ])

  const initializeApp = () => {
    isReady.value = true
  }

  return {
    isReady,
    techStack,
    initializeApp
  }
})