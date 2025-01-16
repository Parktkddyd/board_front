<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <div class="mb-6">
        <!-- Success Icon -->
        <div
          class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
        >
          <svg
            class="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-gray-900 mb-4">
        회원가입이 성공적으로 진행 되었습니다.!
      </h2>

      <p class="text-gray-600 mb-8">
        저희 사이트에 가입해 주셔서 감사합니다.<br />
        계정이 성공적으로 등록 되었습니다.
      </p>

      <div class="space-y-4">
        <router-link
          to="/login"
          class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          로그인
        </router-link>

        <router-link
          to="/"
          class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          홈으로
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignupSuccess",
};
</script>