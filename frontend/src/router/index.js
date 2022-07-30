import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL), // jshint ignore:line
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/add-flight",
      name: "Add Flight",
      component: () => import("../views/AddFlightView.vue"),
    },
    {
      path: "/flight-events",
      name: "Flight Events",
      component: () => import("../views/FlightEventsView.vue"),
    },
    {
      path: "/credits",
      name: "Credits",
      component: () => import("../views/CreditsView.vue"),
    },
    {
      path: "/:catchAll(.*)", // 404 route handling: https://programmerah.com/solved-vue3-configuration-routing-error-catch-all-routes-must-now-be-defined-using-a-param-with-a-custom-regexp-32886/
      name: "404",
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});

export default router;
