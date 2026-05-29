import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./components/views/HomeView.vue";
import AboutView from "./components/views/AboutView.vue";
import QuoteView from "./components/views/QuoteView.vue";
import ProductsView from "./components/views/ProductsView.vue";
import OrdersView from "./components/views/OrdersView.vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import store from "./store";

const routes = [
  { path: "/", component: HomeView },
  { path: "/about", component: AboutView },
  { path: "/quotes", component: QuoteView },
  { path: "/products", component: ProductsView },
  { path: "/orders", component: OrdersView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(VueQueryPlugin).use(store).use(router).mount("#app");
