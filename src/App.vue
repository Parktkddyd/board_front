<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <router-view class="flex-1"></router-view>
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/Navbar.vue'
import Footer from '@/Footer.vue'
import { mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  },
  methods: {
    ...mapActions(['checkAuth'])
  },
  async created(){
    await this.checkAuth()
  }
}
</script>

<style>
</style>
