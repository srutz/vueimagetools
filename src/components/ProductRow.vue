<script setup lang="ts">
import { useStore } from "../store";
import type { Product } from "../store/types";

const props = defineProps<{ product: Product }>();

const store = useStore();

function toggleAvailability() {
  store.commit("setProductAvailability", {
    productId: props.product.id,
    available: !props.product.available,
  });
}

const eur = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});
</script>

<template>
  <li
    class="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-4 py-2 border-b border-gray-100 last:border-b-0 items-center hover:bg-gray-50"
    :class="{ 'opacity-50': !product.available }"
  >
    <div>
      <div class="font-medium text-gray-900">{{ product.name }}</div>
      <div class="text-xs text-gray-500">{{ product.description }}</div>
    </div>
    <div class="capitalize text-gray-600">{{ product.category }}</div>
    <div class="text-right tabular-nums">
      {{ eur.format(product.price) }}
    </div>
    <div class="text-right">
      <button
        class="px-2 py-0.5 rounded-full text-xs font-medium border transition-colors"
        :class="
          product.available
            ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
            : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
        "
        @click="toggleAvailability"
      >
        {{ product.available ? "Available" : "Sold out" }}
      </button>
    </div>
  </li>
</template>
