import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import AboutView from "./components/views/AboutView.vue";
import ImagesView from "./components/views/ImagesView.vue";

const pinia = createPinia();

const routes = [
  { path: "/", component: ImagesView },
  { path: "/about", component: AboutView },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

createApp(App).use(router).use(pinia).mount("#app");
