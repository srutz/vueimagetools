<script lang="ts" setup>
import { Settings } from "@lucide/vue";
</script>

<template>
  <nav class="border-b border-gray-200 flex items-center gap-4 px-4 py-2">
    <Settings />
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/quotes">Quotes</RouterLink>
    <RouterLink to="/products">Products</RouterLink>
    <RouterLink to="/orders">Orders</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>
</template>
