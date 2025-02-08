<template>
  <div :class="[
    'border-b last:border-b-0',
    comment.comment_level === 1 ? 'py-4' : 'pt-4 pb-2'
  ]">
  <!-- 댓글 -->
    <div :class="[
      'flex flex-col gap-2',
      comment.comment_level > 1 ? 'ml-4 pl-4 border-l-2 border-gray-100' : ''
    ]">
    <!-- 댓글 헤더-->
    <div class="flex justify-between items-start">
      <div class="flex items-center gap-2">
        <div class="font-medium text-gray-900">{{ comment.user_id }}</div>
        <span class="text-sm text-gray-500">{{ formatDate(comment.comment_postedTime) }}</span>
      </div>
       <button 
        v-if="canDelete"
        @click="confirmDelete"
        class="text-red-600 hover:text-red-800 text-sm"
      >
        삭제
      </button>
      </div>
      <!-- 댓글 내용 -->
    <p class="text-gray-700">{{ comment.comment_content }}</p>

    <!-- 댓글 액션 -->
      <div class="flex items-center gap-4">
        <!-- 대댓글 버튼 -->
        <button 
          v-if="isAuthenticated"
          @click="toggleReplyForm"
          class="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
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
            <polyline points="15 10 20 15 15 20"/>
            <path d="M4 4v7a4 4 0 0 0 4 4h12"/>
          </svg>
          {{ showReplyForm ? '취소' : '답글 쓰기' }}
        </button>
      </div>

      <!-- 대댓글 폼 -->
      <div v-if="showReplyForm" class="mt-2">
        <ReplyForm
          :board-id="boardId"
          :parent-user-id="comment.user_id"
          :parent-id="comment.comment_id"
          @submit="handleReplySubmit"
          @cancel="toggleReplyForm"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ReplyForm from './ReplyForm.vue'

export default {
  name: 'CommentForm',
  components: {
    ReplyForm
  },
  props: {
    boardId: {
      type: [String, Number],
      required: true
    },
    comment: {
      type: Object,
      required: true
    },
    currentUserId: {
      type: [String, Number],
      default: null
    },
    level: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      showReplyForm: false
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
    canDelete() {
      return this.comment.user_id === this.currentUserId && this.comment.comment_isDeleted == 0
    }

  },
  methods: {
    formatDate(date) {
      const utcDate = new Date(date); 
      const kstDate = new Date(utcDate.getTime() - (9 * 60 * 60 * 1000));

      return kstDate.toLocaleDateString('KOR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    confirmDelete() {
      this.$emit('delete', this.comment.comment_id)
    },
    toggleReplyForm() {
      this.showReplyForm = !this.showReplyForm
    },
    handleReplySubmit() {
      this.showReplyForm = false
      this.$emit('reply-added')
    }
  }
}
</script>