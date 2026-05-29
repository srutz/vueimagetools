<script lang="ts" setup>
import { Settings } from "@lucide/vue";
import { computed } from "vue";
import { useStore } from "../../store";
import SpaceEater from "../SpaceEater.vue";

const store = useStore();
const orders1 = store.getters.orders; // nicht reaktiv
const orders2 = computed(() => store.getters.orders); // reaktiv
const pizzaCount = computed(() => store.getters.pizzaCount);
</script>

<template>
  <nav class="border-b border-gray-200 flex items-center gap-4 px-4 py-2">
    <Settings />
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/quotes">Quotes</RouterLink>
    <RouterLink to="/products">Products</RouterLink>
    <RouterLink to="/orders">Orders</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    <SpaceEater></SpaceEater>
    <div>Order#: {{ orders2.length }}</div>
    <div>Pizza#: {{ pizzaCount }}</div>
  </nav>
</template>
