<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Reddit Clone</h1>
          <p class="text-gray-600">Create and share your posts with the community</p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2">
            <UCard>
              <PostEditor />
            </UCard>
          </div>
          
          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <UCard>
              <template #header>
                <h3 class="text-lg font-medium">Tips for Writing Great Posts</h3>
              </template>
              
              <div class="space-y-4 text-sm">
                <div class="flex items-start gap-3">
                  <UIcon name="i-heroicons-light-bulb" class="text-yellow-500 mt-0.5" />
                  <div>
                    <h4 class="font-medium">Use descriptive titles</h4>
                    <p class="text-gray-600">Make your title clear and engaging to attract readers.</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <UIcon name="i-heroicons-photo" class="text-blue-500 mt-0.5" />
                  <div>
                    <h4 class="font-medium">Add relevant images</h4>
                    <p class="text-gray-600">Visual content helps tell your story better.</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <UIcon name="i-heroicons-hashtag" class="text-green-500 mt-0.5" />
                  <div>
                    <h4 class="font-medium">Format with Markdown</h4>
                    <p class="text-gray-600">Use headers, lists, and formatting to structure your content.</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3">
                  <UIcon name="i-heroicons-link" class="text-purple-500 mt-0.5" />
                  <div>
                    <h4 class="font-medium">Include sources</h4>
                    <p class="text-gray-600">Link to relevant sources and references.</p>
                  </div>
                </div>
              </div>
            </UCard>
            
            <UCard class="mt-6">
              <template #header>
                <h3 class="text-lg font-medium">Markdown Quick Reference</h3>
              </template>
              
              <div class="space-y-3 text-sm">
                <div>
                  <code class="bg-gray-100 px-2 py-1 rounded"># Heading 1</code>
                  <p class="text-gray-600 mt-1">Large heading</p>
                </div>
                
                <div>
                  <code class="bg-gray-100 px-2 py-1 rounded">## Heading 2</code>
                  <p class="text-gray-600 mt-1">Medium heading</p>
                </div>
                
                <div>
                  <code class="bg-gray-100 px-2 py-1 rounded">**bold text**</code>
                  <p class="text-gray-600 mt-1">Bold formatting</p>
                </div>
                
                <div>
                  <code class="bg-gray-100 px-2 py-1 rounded">*italic text*</code>
                  <p class="text-gray-600 mt-1">Italic formatting</p>
                </div>
                
                <div>
                  <code class="bg-gray-100 px-2 py-1 rounded">- List item</code>
                  <p class="text-gray-600 mt-1">Bullet list</p>
                </div>
                
                <div>
                  <code class="bg-gray-100 px-2 py-1 rounded">[link](url)</code>
                  <p class="text-gray-600 mt-1">Create links</p>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Set page metadata
useSeoMeta({
  title: 'Create Post - Reddit Clone',
  description: 'Create and share your posts with the community using our rich text editor with markdown support.'
})
</script>