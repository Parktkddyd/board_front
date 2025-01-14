import Vue from 'vue'
import 'tailwindcss/tailwind.css';
import App from './App.vue'
import router from './router/router';

new Vue({
  router,
  render: h=> h(App)
}).$mount("#app");