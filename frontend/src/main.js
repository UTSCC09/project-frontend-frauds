import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import Particles from "vue3-particles";
import router from "./router";

const app = createApp(App);

app.use(Particles);
app.use(ElementPlus);
app.use(router);

app.mount("#app");
