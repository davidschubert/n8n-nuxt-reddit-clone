<template>
  <nav class="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-lg shadow-md" aria-label="Pagination">
    <div class="hidden sm:block">
      <p class="text-sm text-gray-700">
        Showing page <span class="font-medium">{{ currentPage }}</span> of 
        <span class="font-medium">{{ totalPages }}</span>
      </p>
    </div>
    
    <div class="flex flex-1 justify-between sm:justify-end">
      <!-- Previous Button -->
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage <= 1"
        :class="[
          'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
          currentPage <= 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        ]"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>

      <!-- Page Numbers (visible on larger screens) -->
      <div class="hidden md:flex space-x-1 mx-4">
        <!-- First page -->
        <button
          v-if="startPage > 1"
          @click="goToPage(1)"
          class="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          1
        </button>
        
        <!-- Ellipsis -->
        <span v-if="startPage > 2" class="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700">
          ...
        </span>

        <!-- Page range -->
        <button
          v-for="page in pageRange"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
            page === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          ]"
        >
          {{ page }}
        </button>

        <!-- Ellipsis -->
        <span v-if="endPage < totalPages - 1" class="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700">
          ...
        </span>

        <!-- Last page -->
        <button
          v-if="endPage < totalPages"
          @click="goToPage(totalPages)"
          class="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          {{ totalPages }}
        </button>
      </div>

      <!-- Mobile page indicator -->
      <div class="md:hidden mx-4">
        <span class="text-sm text-gray-700">
          {{ currentPage }} / {{ totalPages }}
        </span>
      </div>

      <!-- Next Button -->
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage >= totalPages"
        :class="[
          'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
          currentPage >= totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        ]"
      >
        Next
        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Jump to page (visible on larger screens) -->
    <div class="hidden lg:flex items-center ml-6 space-x-2">
      <label for="page-jump" class="text-sm text-gray-700">Go to page:</label>
      <input
        id="page-jump"
        v-model="jumpToPageValue"
        @keyup.enter="jumpToPage"
        type="number"
        :min="1"
        :max="totalPages"
        class="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
      <button
        @click="jumpToPage"
        class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Go
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
  maxVisiblePages?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxVisiblePages: 5
})

const emit = defineEmits<{
  'page-change': [page: number]
}>()

const jumpToPageValue = ref(props.currentPage)

// Calculate page range for pagination
const startPage = computed(() => {
  const half = Math.floor(props.maxVisiblePages / 2)
  let start = props.currentPage - half
  
  if (start < 1) {
    start = 1
  }
  
  if (start + props.maxVisiblePages - 1 > props.totalPages) {
    start = Math.max(1, props.totalPages - props.maxVisiblePages + 1)
  }
  
  return start
})

const endPage = computed(() => {
  return Math.min(startPage.value + props.maxVisiblePages - 1, props.totalPages)
})

const pageRange = computed(() => {
  const range = []
  for (let i = startPage.value; i <= endPage.value; i++) {
    range.push(i)
  }
  return range
})

function goToPage(page: number) {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}

function jumpToPage() {
  const page = Number(jumpToPageValue.value)
  if (page >= 1 && page <= props.totalPages) {
    goToPage(page)
  } else {
    jumpToPageValue.value = props.currentPage
  }
}

// Update jump input when current page changes
watch(() => props.currentPage, (newPage) => {
  jumpToPageValue.value = newPage
})
</script>