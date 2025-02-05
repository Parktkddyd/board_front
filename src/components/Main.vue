<template>
  <main class="container mx-auto px-4 py-6">
    <!-- 정렬 -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex gap-2">
        <button class="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          인기순
        </button>
        <button class="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          최신순
        </button>
      </div>
    </div>

    <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">페이지 당 :</label>
          <select 
            v-model="pageSize" 
            class="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="handlePageSizeChange"
          >
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
    </div>

    <!-- 게시글 테이블 -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <!-- 테이블 헤더-->
      <div class="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b text-sm font-medium text-gray-500">
        <div class="col-span-1">번호</div>
        <div class="col-span-5">제목</div>
        <div class="col-span-2">작성자</div>
        <div class="col-span-2">작성일</div>
        <div class="col-span-2 text-center">조회</div>
      </div>

       <!-- 테이블 바디 -->
        <div class="divide-y">
          <div 
            v-for="post in posts" 
            :key="post.board_id"
            class="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div class="col-span-1 text-gray-500">{{ post.board_id }}</div>
            <div class="col-span-5">
              <router-link v-bind:to="{name: 'ReadDetail', params: {id:post.board_id}}"
                class="text-blue-600 hover:text-blue-800 font-medium"
                @click.prevent="viewPost(post.board_id)"
              >
                {{ post.board_title }}
                </router-link>
            </div>
            <div class="col-span-2 text-gray-600">{{ post.user_id }}</div>
            <div class="col-span-2 text-gray-500">{{ formatDate(post.board_createdAt) }}</div>
            <div class="col-span-2 text-center text-gray-500">{{ formatNumber(post.board_viewCnt) }}</div>
          </div>
        </div>

        <!-- 게시글 없는 상태 -->
        <div v-if="posts.length === 0" class="px-6 py-8 text-center text-gray-500">
          일치하는 게시글이 없습니다
        </div>
      </div>

      <!-- 에러 상태 -->
      <div v-if="error" class="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
        {{ error }}
        <button 
          @click="fetchPosts" 
          class="ml-2 underline hover:text-red-800"
        >
          다시 시도해 주세요
        </button>
      </div>

      <!-- 페이징 -->
      <div v-if="totalPosts > 0" class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-500">
          {{ totalPosts }} 개의 게시물 중 {{ paginationStart }} 번째 부터 {{ paginationEnd }} 번째 게시물 
        </div>
        <div class="flex gap-2">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-4 py-2 border rounded-md hover:border-blue-600 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:text-gray-500"
          >
            이전
          </button>
          <div class="flex gap-1">
            <button
              v-for="page in displayedPages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'px-4 py-2 border rounded-md transition-colors',
                currentPage === page 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'hover:border-blue-600 hover:text-blue-600'
              ]"
            >
              {{ page }}
            </button>
          </div>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 border rounded-md hover:border-blue-600 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:hover:border-gray-300 disabled:hover:text-gray-500"
          >
            다음
          </button>
        </div>
      </div>
  </main>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MainPage',
  data() {
    return {
      loading: false,
      error: null,
      posts: [],
      currentPage: 1,
      pageSize: 10,
      totalPosts: 0,
      totalPages: 0,
    }
  },
  computed: {
    paginationStart() {
      return (this.currentPage - 1) * this.pageSize + 1
    },
    paginationEnd() {
      return Math.min(this.currentPage * this.pageSize, this.totalPosts)
    },
    displayedPages() {
      const pages = []
      const maxPages = 5 // 보여질 페이지 버튼 수
      
      if (this.totalPages <= maxPages) {
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i)
        }
      } else {
        let start = this.currentPage - Math.floor(maxPages / 2)
        let end = start + maxPages - 1
        
        if (start < 1) {
          start = 1
          end = maxPages
        }
        
        if (end > this.totalPages) {
          end = this.totalPages
          start = end - maxPages + 1
        }
        
        for (let i = start; i <= end; i++) {
          pages.push(i)
        }
      }
      
      return pages
    }
  },
  methods: {
    async fetchPosts() {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get(process.env.VUE_APP_BACK_URL + '/boards', {
          params: {
            page: this.currentPage-1,
            size: this.pageSize,
          }
        })

        const contents = response.data.data.content
        const totalPosts = response.data.data.totalElements
        const totalPages = response.data.data.totalPages

        this.posts = contents
        this.totalPosts = totalPosts
        this.totalPages = totalPages
      } catch (err) {
        this.error = '게시글을 불러오는 데 실패하였습니다.'
        console.error('게시글 로드 오류: ', err)
      } finally {
        this.loading = false
      }
    },
    formatDate(date) {
      const utcDate = new Date(date);
      const kstDate = new Date(utcDate.getTime() - (9 * 60 * 60 * 1000));
      return kstDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    formatNumber(num) {
      return new Intl.NumberFormat('ko-KR').format(num)
    },
    async changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        await this.fetchPosts()

        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    viewPost(id) {
      this.$router.push(`/boards/${id}`)
    },
    async handlePageSizeChange() {
      this.currentPage = 1 // 첫 페이지로 리셋
      await this.fetchPosts()
    }
  },
  async created() {
    await this.fetchPosts()
  }
}
</script>