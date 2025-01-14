import Vue from "vue";
import VueRouter from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import LoginView from "@/components/LoginView";

Vue.use(VueRouter); 

const routes = [
  {
    path: '/',
    name: 'hello',
    component: HelloWorld,
  },
];

const router = new VueRouter({
  mode: "history", 
  routes: routes,
});


export default router;