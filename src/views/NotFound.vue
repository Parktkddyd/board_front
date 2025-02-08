<template>
  <main class="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
    <div class="max-w-md w-full text-center">
      <!-- 404 Icon -->
      <div class="mb-8">
        <svg 
          class="mx-auto h-24 w-24 text-blue-600" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>

      <!-- Error Title -->
      <h1 class="text-3xl font-bold text-gray-900 mb-4">
        페이지를 찾을 수 없음
      </h1>

      <!-- Error Message -->
      <p class="text-gray-600 mb-8">
        접속 하신 페이지는 존재하지 않거나 삭제된 페이지입니다.
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="goBack"
          class="px-6 py-2 border border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          뒤로 가기
        </button>
        <button
          @click="goHome"
          class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          홈으로
        </button>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    goBack() {
      this.$router.back()
    },
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>