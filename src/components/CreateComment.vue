<template>
  <div class="mt-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">댓글</h2>
    <!-- 댓글 목록 -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="comments.length > 0" class="space-y-4">
      <CommentForm
        v-for="comment in comments"
        :key="comment.comment_id"
        :comment="comment"
        :board-id="boardId"
        :current-user-id="currentUser"
        @delete="deleteComment"
        @reply-added="fetchComments"
      />

      <!-- 페이징 -->
      <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-500">
          {{ totalComments }} 개의 댓글 중 {{ paginationStart }} 번째 부터 {{ paginationEnd }} 번째 댓글
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
    </div>
    <div v-else class="py-8 text-center text-gray-500">
      댓글이 존재하지 않습니다. 첫번째 댓글을 작성해 주세요!
    </div>
    <br><br>
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4">댓글 삭제</h3>
        <p class="text-gray-600 mb-6">댓글을 정말 삭제하시겠습니까?</p>
        <div class="flex justify-end gap-4">
          <button 
            @click="showDeleteModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            취소
          </button>
          <button 
            @click="confirmDeleteComment"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            삭제
          </button>
        </div>
      </div>
    </div>

     <!-- 댓글 폼 -->
    <div v-if="isAuthenticated" class="mb-8">
      <form @submit.prevent="submitComment" class="space-y-4">
        <div>
          <label for="comment" class="sr-only">당신의 댓글</label>
          <textarea
            id="comment"
            v-model="newComment"
            rows="4"
            :disabled="submitting"
            placeholder="댓글을 남겨보세요!"
            class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            :class="{ 'border-red-500': commentError }"
          ></textarea>
          <p v-if="commentError" class="mt-1 text-sm text-red-600">
            {{ commentError }}
          </p>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="submitting || !newComment.trim()"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {{ submitting ? '작성 중...' : '댓글 작성' }}
          </button>
        </div>
      </form>
    </div>
    <div v-else class="mb-8 p-4 bg-gray-50 rounded-md">
      <p class="text-gray-600">
      
        <router-link 
          :to="{ name: 'login', query: { redirect: $route.fullPath }}"
          class="text-blue-600 hover:text-blue-800"
        >
        로그인
        </router-link>
         후 댓글을 작성해 보세요!.
      </p>
    </div>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CommentForm from './CommentForm.vue'

export default {
  name: 'CreateComment',
  components: {
    CommentForm
  },
  props: {
    boardId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      comments: [],
      newComment: '',
      commentError: '',
      loading: false,
      submitting: false,
      currentPage: 1,
      totalComments: 0,
      totalPages: 0,
      commentsPerPage: 10,
      showDeleteModal: false,
      commentToDelete: null
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'currentUser']),
    paginationStart() {
      return (this.currentPage - 1) * this.commentsPerPage + 1
    },
    paginationEnd() {
      return Math.min(this.currentPage * this.commentsPerPage, this.totalComments)
    },
    displayedPages() {
      const pages = []
      const maxPages = 5
      
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
    async fetchComments() {
      this.loading = true
      try {
        const response = await this.$axios.get(`/api/v1/boards/${this.boardId}/comments`, {
          params: {
            page: this.currentPage-1,
            size: this.commentsPerPage
          },
        })
        this.comments = response.data.data.content
        this.totalComments = response.data.data.totalElements
        this.totalPages = response.data.data.totalPages
      } catch (err) {
        console.error('댓글 로드 에러:', err)
      } finally {
        this.loading = false
      }
    },
    async submitComment() {
      if (!this.newComment.trim()) {
        this.commentError = '내용은 최소 1글자 이상입니다'
        return
      }

      if (this.newComment.length > 1000) {
        this.commentError = '내용은 최대 200글자 입니다.'
        return
      }

      this.submitting = true
      this.commentError = ''

      try {
        await this.$axios.post(`/api/v1/boards/${this.boardId}/comments/post`, {
          comment_content: this.newComment
        })
        
        this.newComment = ''
        await this.fetchComments()
      } catch (err) {
        this.commentError = '댓글 작성에 실패했습니다 다시 시도해 주세요'
        console.error('댓글 작성 실패:', err)
      } finally {
        this.submitting = false
      }
    },
    deleteComment(commentId) {
      this.commentToDelete = commentId
      this.showDeleteModal = true
    },
    async confirmDeleteComment() {
      try {
        await this.$axios.delete(`/api/v1/boards/${this.boardId}/comments/${this.commentToDelete}`)
        await this.fetchComments()
      } catch (err) {
        console.error('댓글 삭제 에러:', err)
      } finally {
        this.showDeleteModal = false
        this.commentToDelete = null
      }
    },
    async changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        await this.fetchComments()

        this.$el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  },
  async created() {
    await this.fetchComments()
  }
}
</script>