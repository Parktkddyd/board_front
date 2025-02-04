<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- 제목 -->
    <div>
      <br>
      <label for="board_title" class="block text-sm font-medium text-gray-700 mb-1">
        글 제목
      </label>
      <input
        id="board_title"
        v-model="formData.title"
        type="text"
        required
        :disabled="loading"
        class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        :class="{ 'border-red-500': errors.title }"
        @input="checkChanges"
      />
      <p v-if="errors.title" class="mt-1 text-sm text-red-600">
        {{ errors.title }}
      </p>
    </div>
    <!-- 게시글 작성 영역 -->
    <div>
      <label for="board_content" class="block text-sm font-medium text-gray-700 mb-1">
        글 내용
      </label>
      <textarea
        id="board_content"
        v-model="formData.content"
        required
        :disabled="loading"
        rows="12"
        class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        :class="{ 'border-red-500': errors.content }"
        @input="checkChanges"
      ></textarea>
      <p v-if="errors.content" class="mt-1 text-sm text-red-600">
        {{ errors.content }}
      </p>
    </div>

    <!-- 변경점 감지 -->
    <div v-if="isEditing && !hasChanges" class="p-4 bg-yellow-50 rounded-md">
      <p class="text-yellow-700">게시글에 변경된 점이 없습니다</p>
    </div>

    <!-- 버튼 동작 -->
    <div class="flex gap-4">
      <button
        type="submit"
        :disabled="loading || (isEditing && !hasChanges)"
        class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
      >
        {{ loading ? '저장 중...' : submitButtonText }}
      </button>
      <button
        type="button"
        :disabled="loading"
        @click="cancel"
        class="px-6 py-2 border border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
      >
        취소
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'PostForm',
  props: {
    initialData: {
      type: Object,
      default: () => ({
        title: '',
        content: ''
      })
    },
    loading: {
      type: Boolean,
      default: false
    },
    submitButtonText: {
      type: String,
      default: '글 작성'
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: { ...this.initialData },
      originalData: { ...this.initialData },
      errors: {},
      hasChanges: false
    }
  },
  watch: {
    initialData: {
      handler(newData) {
        this.formData = { ...newData }
        this.originalData = { ...newData }
        this.checkChanges()
      },
      deep: true
    }
  },
  methods: {
    validate() {
      this.errors = {}
      
      if (!this.formData.title.trim()) {
        this.errors.title = '글 제목을 작성해 주세요'
      } else if (this.formData.title.length <=0) {
        this.errors.title = '글 제목의 길이는 최소 1글자 이상입니다'
      } else if (this.formData.title.length > 100) {
        this.errors.title = '제목은 최대 100글자 입니다'
      }

      if (!this.formData.content.trim()) {
        this.errors.content = '내용을 작성해 주세요'
      } else if (this.formData.content.length <= 0) {
        this.errors.content = '내용은 최소 1글자 이상입니다'
      }else if (this.formData.content.length > 50000) {
        this.validationErrors.content = '내용은 최대 50,000글자 이하 입니다'
      }

      return Object.keys(this.errors).length === 0
    },
    checkChanges() {
      if (this.isEditing) {
        this.hasChanges = 
          this.formData.title !== this.originalData.title ||
          this.formData.content !== this.originalData.content
      }
    },
    handleSubmit() {
      if (this.validate()) {
         if (this.isEditing && !this.hasChanges) {
          return
        }
        this.$emit('submit', { ...this.formData })
      }
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>