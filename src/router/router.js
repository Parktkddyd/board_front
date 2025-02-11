import Vue from "vue";
import VueRouter from "vue-router"
import store from "@/store/store.js"
import LoginView from "@/views/LoginView.vue"
import SignupView from "@/views/SignupView.vue"
import SignupSuccess from "@/views/SignupSuccess.vue"
import Main from "@/Main.vue"
import ReadDetail from "@/views/ReadDetail.vue"
import CreatePost from "@/views/CreatePost.vue"
import EditPost from "@/views/EditPost.vue"
import NotFound from "@/views/NotFound.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guest: true }
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView,
    meta: { guest: true }
  },
  {
    path: '/signup/success',
    name: 'SignupSuccess',
    component: SignupSuccess,
    meta: { guest: true }
  },
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/boards/:id',
    name: 'ReadDetail',
    component: ReadDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/post',
    name: 'CreatePost',
    component: CreatePost,
    meta: { requiresAuth: true }
  },
  {
    path: '/boards/:id/edit',
    name: 'EditPost',
    component: EditPost,
    meta: { requiresAuth: true }
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routes,
});

router.beforeEach(async (to, from, next) => {

  const isAuthenticated = store.getters.isAuthenticated

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      const isValid = await store.dispatch('checkAuth');

      if (!isValid) {
        return next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      }
    }
    next()
  } else if (to.matched.some(record => record.meta.guest)) {
    if (isAuthenticated) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router;