<template>
  <form @submit.prevent="submitReply" class="space-y-4">
    <div>
      <textarea
        v-model="replyContent"
        rows="3"
        :disabled="submitting"
        :placeholder="`${replyHeader} 님에게 댓글을 작성해보세요!`"
        class="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        :class="{ 'border-red-500': error }"
      ></textarea>
      <p v-if="error" class="mt-1 text-sm text-red-600">
        {{ error }}
      </p>
    </div>
    <div class="flex gap-2">
      <button
        type="submit"
        :disabled="submitting || !replyContent.trim()"
        class="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
      >
        {{ submitting ? '작성 중...' : '답글 작성' }}
      </button>
      <button
        type="button"
        :disabled="submitting"
        @click="$emit('cancel')"
        class="px-4 py-1.5 text-sm border border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
      >
        취소
      </button>
    </div>
  </form>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ReplyForm',
  props: {

    boardId: {
      type: [String, Number],
      required: true
    },

    parentId: {
      type: [String, Number],
      required: true
    },
    parentUserId: {
      type:[String, Object],
      required: true
    }
  },
  data() {
    return {
      replyHeader: '@' + this.parentUserId + ' ', 
      replyContent: '',
      submitting: false,
      error: ''
    }
  },
  methods: {
    async submitReply() {
      if (!this.replyContent.trim()) {
        this.error = '답글은 최소 1글자 이상입니다'
        return
      }

      if (this.replyContent.length > 500) {
        this.error = '답글은 최대 500글자 이하입니다'
        return
      }

      this.submitting = true
      this.error = ''

      try {
        await axios.post(process.env.VUE_APP_BACK_URL + `/boards/${this.boardId}/comments/repost`, {
          comment_content: this.replyContent,
          parent_id: this.parentId
        },
        {withCredentials : true}
    )
        this.replyContent = ''
        this.$emit('submit')
      } catch (err) {
        this.error = '답글 작성에 실패했습니다 다시 시도해 주세요'
        console.error('답글 작성 실패:', err)
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>