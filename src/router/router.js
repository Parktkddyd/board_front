import Vue from "vue";
import VueRouter from "vue-router";
import LoginView from "@/components/LoginView";
import SignupView from "@/components/SignupView";

Vue.use(VueRouter); 

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView
  }
];

const router = new VueRouter({
  mode: "history", 
  routes: routes,
});


export default router;