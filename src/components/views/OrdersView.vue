<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "../../store";
import type { Order, Product } from "../../store/types";
import NewOrderDialog from "./NewOrderDialog.vue";
import OrderCard from "../OrderCard.vue";

const store = useStore();

const availableCount = computed(
  () => (store.getters.availableProducts as Product[]).length,
);

const orders = computed<Order[]>(() => store.getters.ordersInPreparation);

const dialogOpen = ref(false);
</script>

<template>
  <main class="p-4 flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold">Orders</h1>
        <p class="text-sm text-gray-500">
          {{ availableCount }} products available
        </p>
      </div>
      <button
        type="button"
        class="px-3 py-1.5 rounded-md bg-green-600 text-white text-sm hover:bg-green-700"
        @click="dialogOpen = true"
      >
        New order
      </button>
    </div>

    <ul class="flex flex-col gap-3">
      <OrderCard v-for="order in orders" :key="order.id" :order="order" />

      <li v-if="orders.length === 0" class="text-sm text-gray-500">
        No orders in preparation.
      </li>
    </ul>

    <NewOrderDialog v-model="dialogOpen" />
  </main>
</template>
