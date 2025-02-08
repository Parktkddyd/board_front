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
  },
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/boards/:id',
    name: 'ReadDetail',
    component: ReadDetail
  },
  {
    path: '/post',
    name: 'CreatePost',
    component: CreatePost
  },
  {
    path: '/boards/:id/edit',
    name: 'EditPost',
    component: EditPost
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
  if (to.name === 'Error') {
    next()
    return
  }

  const isAuthenticated = store.getters.isAuthenticated

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
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