import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/add-flight",
      name: "add flight",
      component: () => import("../views/AddFlightView.vue"),
    },
    {
      path: "/signin",
      name: "sign in",
      component: () => import("../views/SignIn.vue"),
    },
    {
      path: "/signup",
      name: "sign up",
      component: () => import("../views/SignUp.vue"),
    },
  ],
});

export default router;
