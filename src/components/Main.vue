<template>
  <main class="container mx-auto px-4 py-6">
    <!-- Filters & Sort -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex gap-2">
        <button class="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          Popular
        </button>
        <button class="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          Latest
        </button>
      </div>
    </div>

    <!-- Posts Grid -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="i in 6" 
        :key="i"
        class="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div class="p-4">
          <div class="aspect-video w-full bg-gray-200 rounded-md mb-4"></div>
          <h3 class="text-lg font-semibold mb-2">Sample Post Title {{ i }}</h3>
          <p class="text-gray-600 mb-4">
            This is a brief description of the post content. It gives readers a quick overview of what to expect.
          </p>
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>John Doe</span>
            <span>2 hours ago</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Load More -->
    <div class="mt-8 text-center">
      <button class="px-6 py-2 border rounded-md hover:border-blue-600 hover:text-blue-600 transition-colors">
        더 보기
      </button>
    </div>
  </main>
</template>

<script>
export default {
  name: 'MainPage',
  data() {
    return {
      selectedCategory: 'all'
    }
  }
}
</script>