<template>
  <nav class="sticky top-0 z-50 w-full border-b bg-white">
    <div class="container mx-auto px-4 flex h-16 items-center justify-between">
      <!-- Logo & Main Navigation -->
      <div class="flex items-center gap-6">
        <router-link to="/" class="text-xl font-bold">
          자유로운 게시판
        </router-link>
        <div class="hidden md:flex gap-4">
          <router-link 
            to="/"
            class="text-sm font-medium transition-colors hover:text-blue-600"
            :class="{ 'text-blue-600': $route.path === '/', 'text-gray-600': $route.path !== '/' }"
          >
            홈
          </router-link>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <template v-if="isAuthenticated">
          <span class="text-xm text-gray-600">{{ currentUser }} 님</span>
          <button 
            @click="handleNewPost"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            글 작성하기
          </button>
          <button
            @click="handleLogout"
            class="text-gray-600 hover:text-blue-600 transition-colors"
          >
            로그아웃
          </button>
        </template>
        <template v-else>
          <router-link 
            to="/login"
            class="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            로그인
          </router-link>
          <router-link 
            to="/signup"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            회원가입
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'NavigationBar',
  computed: {
    ...mapGetters(['isAuthenticated', 'currentUser'])
  },
  methods: {
    ...mapActions(['logout']),

    handleNewPost(){
        this.$router.push('/post').catch(()=> {})
    },

    async handleLogout(){
        const response = await this.$axios.get('/api/v1/users/logout');
          if(response.data.header.customStatusCode == 'ACCOUNT-LOGOUT-200')
            await this.logout()
    }
  },
}
</script>