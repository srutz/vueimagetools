import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

import { createPinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import AboutView from "./components/views/AboutView.vue";
import HomeView from "./components/views/HomeView.vue";
import ImagesView from "./components/views/ImagesView.vue";

const pinia = createPinia();

const routes = [
  { path: "/", component: HomeView },
  { path: "/images", component: ImagesView },
  { path: "/about", component: AboutView },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

createApp(App).use(router).use(pinia).mount("#app");
