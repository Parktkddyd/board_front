import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/components/store/store"
import LoginView from "@/components/LoginView";
import SignupView from "@/components/SignupView";
import SignupSuccess from "@/components/SignupSuccess"
import Main from "@/components/Main"
import ReadDetail from "@/components/ReadDetail.vue";
import CreatePost from "@/components/CreatePost.vue";
import EditPost from "@/components/EditPost.vue";
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
  }
];

const router = new VueRouter({
  mode: "history",
  routes: routes,
});

router.beforeEach(async (to, from, next) => {
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