<template>
  <main class="container mx-auto px-4 py-6">
    <div class="max-w-3xl mx-auto">
      <div v-if="initialLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <template v-else>
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">글 수정</h1>
        </div>
        
        <div 
          v-if="error"
          class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p class="text-red-600">{{ error }}</p>
        </div>
        
        <PostForm
          v-if="post"
          :initial-data="editedPost"
          :loading="saving"
          :is-editing="true"
          submit-button-text="수정"
          @submit="updatePost"
          @cancel="cancel"
        />
      </template>
    </div>
  </main>
</template>

<script>
import PostForm from '@/components/PostForm.vue'

export default {
  name: 'EditPost',
  components: {
    PostForm
  },
  data() {
    return {
      post: null,
      editedPost: {
        title: '',
        content: ''
      },
      initialLoading: true,
      saving: false,
      error: null
    }
  },
  computed: {
    postId() {
      return this.$route.params.id
    },
  },
  methods: {
    async fetchPost() {
      try {
        const response = await this.$axios.get(`/boards/${this.postId}`)
        this.post = response.data.data
        this.editedPost = {
          title: response.data.data.board_title,
          content: response.data.data.content,
        }
      } catch (err) {
        this.error = '게시글을 불러오는데 실패했습니다. 다시 시도해 주세요'
        console.error('게시글 불러오기 실패:', err)
      } finally {
        this.initialLoading = false
      }
    },
    async updatePost(formData) {
      this.saving = true
      this.error = null

      try {
        await this.$axios.put(`/boards/${this.postId}`,  {
          board_title : formData.title,
          board_content: formData.content,
         })
        this.$router.push(`/boards/${this.postId}`)
      } catch (err) {
        this.error = '게시글 수정에 실패했습니다 다시 시도해 주세요'
        console.error('게시글 수정 실패:', err)
      } finally {
        this.saving = false
      }
    },
    cancel() {
      this.$router.push(`/boards/${this.postId}`)
    }
  },
  async created() {
    await this.fetchPost()
  },
  beforeRouteLeave(to, from, next) {
    if (!this.$refs.postForm?.hasChanges || this.saving) {
      next()
    } else {
      const answer = window.confirm('저장하지 않은 내용이 있습니다 정말 나가시겠습니까?')
      if (answer) {
        next()
      } else {
        next(false)
      }
    }
  }
}
</script>