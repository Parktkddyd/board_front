import Vue from 'vue'
import 'tailwindcss/tailwind.css'
import App from '@/App.vue'
import router from '@/router/router'
import store from "@/store/store.js"
import axios from '@/service/axios.js'

Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

