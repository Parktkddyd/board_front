<template>
  <div>
    <NotFound 
      v-if="status === 404"
    />
    
    <slot v-else></slot>
  </div>
</template>

<script>
import NotFound from '@/views/NotFound.vue'

export default {
  name: 'ResponseWrapper',
  components: {
    NotFound
  },
  props: {
    // The API response data
    response: {
      type: Object,
      required: true
    }
  },
  computed: {
    status() {
      return this.response?.header?.statusCode || 200
    }
  }
}
</script>