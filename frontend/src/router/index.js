import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { authGuard } from "@auth0/auth0-vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL), // jshint ignore:line
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      beforeEnter: authGuard,
    },
    {
      path: "/add-flight",
      name: "Add Flight",
      component: () => import("../views/AddFlightView.vue"),
      beforeEnter: authGuard,
    },
    {
      path: "/bookings",
      name: "bookings",
      component: () => import("../views/ProfileView.vue"),
      beforeEnter: authGuard,
    },
    {
      path: "/flight-events",
      name: "Flight Events",
      component: () => import("../views/FlightEventsView.vue"),
      beforeEnter: authGuard,
    },
    {
      path: "/credits",
      name: "Credits",
      component: () => import("../views/CreditsView.vue"),
      beforeEnter: authGuard,
    },
    {
      path: "/:catchAll(.*)", // 404 route handling: https://programmerah.com/solved-vue3-configuration-routing-error-catch-all-routes-must-now-be-defined-using-a-param-with-a-custom-regexp-32886/
      name: "404",
      component: () => import("../views/NotFoundView.vue"),
      beforeEnter: authGuard,
    },
  ],
});

export default router;
