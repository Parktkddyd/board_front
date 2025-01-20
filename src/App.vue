<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Navbar />
    <router-view class="flex-1"></router-view>
    <Footer />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  }
}
</script>

<style>
</style>
