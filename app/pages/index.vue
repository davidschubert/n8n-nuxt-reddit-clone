<template>
  <div class="posts-page">
    <!-- SEO Meta Tags -->
    <Head>
      <Title>{{ pageTitle }}</Title>
      <Meta name="description" :content="pageDescription" />
      <Meta property="og:title" :content="pageTitle" />
      <Meta property="og:description" :content="pageDescription" />
      <Meta property="og:type" content="website" />
      <Meta property="og:url" :content="canonicalUrl" />
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" :content="pageTitle" />
      <Meta name="twitter:description" :content="pageDescription" />
      <Link rel="canonical" :href="canonicalUrl" />
    </Head>

    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Reddit Clone Posts
        </h1>
        <p class="text-lg text-gray-600">
          Discover and discuss the latest topics in our community
        </p>
      </header>

      <!-- Controls -->
      <div class="flex flex-col md:flex-row gap-4 mb-8">
        <!-- Sort Options -->
        <div class="flex gap-2">
          <button
            v-for="sortOption in sortOptions"
            :key="sortOption.value"
            @click="changSort(sortOption.value)"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              currentSort === sortOption.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            {{ sortOption.label }}
          </button>
        </div>

        <!-- Search -->
        <div class="flex-1 max-w-md">
          <input
            v-model="searchTerm"
            @keyup.enter="performSearch"
            type="text"
            placeholder="Search posts..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
        </div>

        <!-- Category Filter -->
        <select
          v-model="selectedCategory"
          @change="changeCategory"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          <option value="general">General</option>
          <option value="technology">Technology</option>
          <option value="discussion">Discussion</option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="space-y-4">
        <PostSkeleton v-for="i in 5" :key="i" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-500 text-xl mb-4">
          Failed to load posts
        </div>
        <button
          @click="refresh()"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>

      <!-- Posts List -->
      <div v-else-if="data?.posts.length" class="space-y-6">
        <PostCard
          v-for="post in data.posts"
          :key="post.id"
          :post="post"
        />

        <!-- Pagination -->
        <Pagination
          v-if="data.totalPages > 1"
          :current-page="data.page"
          :total-pages="data.totalPages"
          @page-change="changePage"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="text-gray-500 text-xl">
          No posts found
        </div>
        <p class="text-gray-400 mt-2">
          Try adjusting your search or filters
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PostsResponse, SortOption } from '~/types/posts'

// SEO and Meta
const route = useRoute()
const router = useRouter()

const currentSort = ref<SortOption>((route.query.sort as SortOption) || 'hot')
const currentPage = ref(Number(route.query.page) || 1)
const selectedCategory = ref(route.query.category as string || '')
const searchTerm = ref(route.query.search as string || '')

// Page meta data
const pageTitle = computed(() => {
  let title = 'Posts'
  if (selectedCategory.value) {
    title += ` in ${selectedCategory.value}`
  }
  if (searchTerm.value) {
    title += ` - Search: ${searchTerm.value}`
  }
  return `${title} | Reddit Clone`
})

const pageDescription = computed(() => {
  if (searchTerm.value) {
    return `Search results for "${searchTerm.value}" in our Reddit-style community platform.`
  }
  if (selectedCategory.value) {
    return `Browse ${selectedCategory.value} posts in our Reddit-style community platform.`
  }
  return 'Browse the latest posts and discussions in our Reddit-style community platform. Join the conversation!'
})

const canonicalUrl = computed(() => {
  const url = new URL(route.fullPath, 'https://reddit-clone.example.com')
  return url.toString()
})

// Sort options
const sortOptions = [
  { value: 'hot' as SortOption, label: 'Hot' },
  { value: 'new' as SortOption, label: 'New' },
  { value: 'top' as SortOption, label: 'Top' }
]

// Data fetching with SSR
const { data, pending, error, refresh } = await useFetch<PostsResponse>('/api/posts', {
  key: 'posts',
  query: {
    page: currentPage,
    sort: currentSort,
    category: selectedCategory,
    search: searchTerm,
    limit: 20
  },
  default: () => ({
    posts: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  })
})

// Methods
function changSort(sort: SortOption) {
  currentSort.value = sort
  currentPage.value = 1
  updateUrl()
}

function changePage(page: number) {
  currentPage.value = page
  updateUrl()
  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function changeCategory() {
  currentPage.value = 1
  updateUrl()
}

function performSearch() {
  currentPage.value = 1
  updateUrl()
}

function updateUrl() {
  const query: Record<string, any> = {}
  
  if (currentPage.value > 1) {
    query.page = currentPage.value
  }
  
  if (currentSort.value !== 'hot') {
    query.sort = currentSort.value
  }
  
  if (selectedCategory.value) {
    query.category = selectedCategory.value
  }
  
  if (searchTerm.value) {
    query.search = searchTerm.value
  }
  
  router.push({ query })
}

// Watch for URL changes
watch(() => route.query, (newQuery) => {
  currentSort.value = (newQuery.sort as SortOption) || 'hot'
  currentPage.value = Number(newQuery.page) || 1
  selectedCategory.value = newQuery.category as string || ''
  searchTerm.value = newQuery.search as string || ''
}, { immediate: true })

// JSON-LD Structured Data - commented out for now due to potential issues
// useSchemaOrg([
//   {
//     '@type': 'WebPage',
//     '@id': canonicalUrl.value,
//     name: pageTitle.value,
//     description: pageDescription.value,
//     url: canonicalUrl.value,
//     isPartOf: {
//       '@type': 'WebSite',
//       name: 'Reddit Clone',
//       url: 'https://reddit-clone.example.com'
//     }
//   }
// ])
</script>

<style scoped>
.posts-page {
  min-height: 100vh;
  background-color: #f9fafb;
}

.container {
  max-width: 1200px;
}
</style>