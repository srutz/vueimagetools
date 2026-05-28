import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./components/views/HomeView.vue";
import AboutView from "./components/views/AboutView.vue";
import QuoteView from "./components/views/QuoteView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/about", component: AboutView },
  { path: "/quotes", component: QuoteView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount("#app");
