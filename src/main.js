import Vue from 'vue'
import 'tailwindcss/tailwind.css'
import App from './App.vue'
import router from './router/router'
import store from "@/components/store/store"

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

