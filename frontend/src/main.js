import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import Particles from "vue3-particles";
import router from "./router";
import { createAuth0 } from "@auth0/auth0-vue";
import config from "../config.js";

const app = createApp(App);

app.use(Particles);
app.use(ElementPlus);
app.use(router);
app.use(
  // IMPORTANT: This MUST not be moved above router init, or it will break authGuard.
  createAuth0({
    domain: config.DOMAIN,
    client_id: config.CLIENT_ID,
    redirect_uri: window.location.origin,
    audience: config.AUDIENCE,
  })
);

app.mount("#app");
