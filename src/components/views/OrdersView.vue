<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "../../store";
import type { Order, Product } from "../../store/types";
import NewOrderDialog from "./NewOrderDialog.vue";

const store = useStore();

const availableCount = computed(
  () => (store.getters.availableProducts as Product[]).length,
);

const orders = computed<Order[]>(() => store.getters.ordersInPreparation);

const dialogOpen = ref(false);

function productName(id: string): string {
  const product: Product | undefined = store.getters.productById(id);
  return product?.name ?? "Unknown";
}

function orderTotal(id: string): number {
  return store.getters.orderTotal(id);
}

function advance(id: string) {
  store.dispatch("advanceOrder", id);
}

function checkout(id: string) {
  store.dispatch("checkout", id);
}

const eur = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

const statusClass: Record<Order["status"], string> = {
  queued: "bg-gray-100 text-gray-600",
  preparing: "bg-amber-100 text-amber-800",
  ready: "bg-blue-100 text-blue-800",
  served: "bg-green-100 text-green-800",
};
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
      <li
        v-for="order in orders"
        :key="order.id"
        class="border border-gray-200 rounded-md p-3 shadow-sm"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="font-medium">Table {{ order.table }}</span>
            <span
              class="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
              :class="statusClass[order.status]"
            >
              {{ order.status }}
            </span>
          </div>
          <span class="text-sm tabular-nums text-gray-700">
            {{ eur.format(orderTotal(order.id)) }}
          </span>
        </div>

        <ul class="text-sm text-gray-600 mb-2">
          <li v-for="line in order.lines" :key="line.productId">
            {{ line.quantity }}× {{ productName(line.productId) }}
          </li>
        </ul>

        <div class="flex justify-end gap-2">
          <button
            v-if="order.status !== 'served'"
            type="button"
            class="px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-100 text-xs"
            @click="advance(order.id)"
          >
            Advance
          </button>
          <button
            type="button"
            class="px-2 py-1 rounded-md bg-gray-900 text-white text-xs hover:bg-gray-700"
            @click="checkout(order.id)"
          >
            Checkout
          </button>
        </div>
      </li>

      <li v-if="orders.length === 0" class="text-sm text-gray-500">
        No orders in preparation.
      </li>
    </ul>

    <NewOrderDialog v-model="dialogOpen" />
  </main>
</template>
