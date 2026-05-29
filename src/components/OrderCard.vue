<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "../store";
import type { Order, Product } from "../store/types";

const props = defineProps<{ order: Order }>();

const store = useStore();

function productName(id: string): string {
  const product: Product | undefined = store.getters.productById(id);
  return product?.name ?? "Unknown";
}

const total = computed<number>(() => store.getters.orderTotal(props.order.id));

function advance() {
  store.dispatch("advanceOrder", props.order.id);
}

function checkout() {
  store.dispatch("checkout", props.order.id);
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
  <li class="border border-gray-200 rounded-md p-3 shadow-sm">
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
        {{ eur.format(total) }}
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
        @click="advance"
      >
        Advance
      </button>
      <button
        type="button"
        class="px-2 py-1 rounded-md bg-gray-900 text-white text-xs hover:bg-gray-700"
        @click="checkout"
      >
        Checkout
      </button>
    </div>
  </li>
</template>
