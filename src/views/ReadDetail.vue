<template>
  <main class="container mx-auto px-4 py-6">
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error" class="max-w-3xl mx-auto">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div class="text-red-600 mb-4">{{ error }}</div>
        <div class="space-x-4">
          <button 
            @click="fetchPost" 
            class="text-red-600 hover:text-red-800 underline"
          >
            다시 시도
          </button>
          <button 
            @click="goToList" 
            class="text-red-600 hover:text-red-800 underline"
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>

  <ResponseWrapper v-else-if = "response" :response="response">
    <div class="max-w-3xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <button 
          @click="goToList" 
          class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          목록
        </button>

        <!-- 접근 권한에 따른 뷰 변경점 -->
        <div v-if="isAuthenticated && isAuthor" class="flex gap-3">
          <button 
            @click="editPost" 
            class="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            </svg>
            수정
          </button>
          <button 
            @click="confirmDelete" 
            class="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors flex items-center gap-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            >
              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
            삭제
          </button>
        </div>
      </div>
      
      <div v-if="post">
      <!-- 게시글 헤더 -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ post.board_title }}</h1>
        <div class="flex items-center gap-6 text-sm text-gray-500">
          <div class="flex items-center gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            >
              <circle cx="12" cy="8" r="4"/>
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
            </svg>
            {{ post.user_id }}
          </div>
          <div class="flex items-center gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {{ formatDate(post.board_createdAt) }}
          </div>
          <div class="flex items-center gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            {{ formatNumber(post.board_viewCnt) }} views
          </div>
        </div>
      </div>

      <!-- 게시글 내용 -->
      <div class="bg-white rounded-lg shadow-sm p-6 prose max-w-none">
        {{ post.content }}
      </div>
      <!-- 댓글 내용-->
       <div v-if="!loading && !error">
        <CreateComment :board-id="$route.params.id" />
      </div>

      <!-- 삭제 모달-->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold mb-4">게시글 삭제</h3>
          <p class="text-gray-600 mb-6">게시글을 삭제하시겠습니까?</p>
          <div class="flex justify-end gap-4">
            <button 
              @click="showDeleteModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              취소
            </button>
            <button 
              @click="deletePost"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
        </div>
       </div>
      </div>
  </ResponseWrapper>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import CreateComment from '@/components/CreateComment.vue'
import ResponseWrapper from '@/components/ResponseWrapper.vue';

export default {
  name: 'ReadDetail',
   components: {
    ResponseWrapper,
    CreateComment
  },
  data() {
    return {
      loading: true,
      error: null,
      response: null,
      post: null,
      showDeleteModal: false
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'currentUser']),
    isAuthor() {
      return this.post.user_id === this.currentUser
    }
  },
  methods: {
    async fetchPost() {
      this.loading = true
      this.error = null
      
      try {
        const {data} = await this.$axios.get(`/boards/${this.$route.params.id}`)
        this.response = data
    
        if(data.header.statusCode == 200){
          this.post = data.data
        }
        
        //조회수 증가
        //await axios.post(`/api/posts/${this.$route.params.id}/view`)
      } catch (err) {
        this.error = '게시글을 불러오는데 실패하였습니다 다시 시도해 주세요'
        console.error('에러:', err)
      } finally {
        this.loading = false
      }
    },
    formatDate(date) {
      const utcDate = new Date(date);
      const kstDate = new Date(utcDate.getTime() - (9 * 60 * 60 * 1000));

      return kstDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    formatNumber(num) {
      return new Intl.NumberFormat('ko-KR').format(num)
    },
    goToList() {
      this.$router.push('/')
    },
    editPost() {
      this.$router.push(`/boards/${this.$route.params.id}/edit`)
    },
    confirmDelete() {
      this.showDeleteModal = true
    },
    async deletePost() {
      try {
        await this.$axios.delete(`/boards/${this.$route.params.id}`)
        this.$router.push('/')
      } catch (err) {
        console.error('삭제 실패', err)
      }
      this.showDeleteModal = false
    }
  },
  async created() {
    await this.fetchPost()
  },
  watch: {
    post: {
      immediate: true,
      handler(post) {
        if (post) {
          document.title = `${post.board_title} - 게시판`
        }
      }
    }
  }
}
</script>

<style>
.prose {
  line-height: 1.75;
}
.prose p {
  margin-bottom: 1.25em;
}
</style>