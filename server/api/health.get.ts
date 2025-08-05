export default defineEventHandler(async (event) => {
  try {
    const connectionStatus = await checkAppwriteConnection()
    
    return {
      appwrite: connectionStatus,
      config: {
        endpoint: useRuntimeConfig().public.appwriteEndpoint,
        projectId: useRuntimeConfig().public.appwriteProjectId,
        hasApiKey: !!useRuntimeConfig().appwriteApiKey
      },
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to check Appwrite connection',
      data: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
})