<template>
  <main class="container mx-auto px-4 py-6">
    <div class="max-w-3xl mx-auto">
      <!-- 헤더 -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">새 글 작성하기</h1>
      </div>

      <!-- 에러 경고 -->
      <div 
        v-if="error"
        class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
      >
        <p class="text-red-600">{{ error }}</p>
      </div>

      <!-- 작성 폼 -->
      <PostForm
        :loading="loading"
        submit-button-text="글 작성"
        @submit="createPost"
        @cancel="cancel"
      />
    </div>
  </main>
</template>

<script>
import axios from 'axios'
import PostForm from '@/components/PostForm.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'CreatePost',
  components: {
    PostForm
  },
  data() {
    return {
      loading: false,
      error: null
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'currentUser'])
  },
  methods: {
    async createPost(formData) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(process.env.VUE_APP_BACK_URL + '/boards/post',
         {
          board_title : formData.title,
          board_content: formData.content,
          user_id : this.currentUser
         },
        {withCredentials : true})
        this.$router.push(`/boards/${response.data.data.board_id}`)
      } catch (err) {
        this.error = '게시글 작성에 실패했습니다 다시 시도해 주세요'
        console.error('게시글 작성 에러:', err)
      } finally {
        this.loading = false
      }
    },
    cancel() {
      this.$router.push('/')
    }
  }
}
</script>