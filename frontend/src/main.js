import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import Particles from "vue3-particles";
import router from "./router";
import { auth0 } from "./services/auth";

const app = createApp(App);

app.use(Particles);
app.use(ElementPlus);
app.use(router);
/*
 * IMPORTANT: This MUST not be moved above router init, or it will break authGuard.
 * Also note that we import auth0 from our services to allow for usage of auth0 SDK functions outside of components.
 * https://github.com/auth0/auth0-vue/issues/99#issuecomment-1099704276
 */
app.use(auth0);

app.mount("#app");
