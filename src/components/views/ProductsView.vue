<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "../../store";
import type { Product } from "../../store/types";
import ProductRow from "../ProductRow.vue";

const store = useStore();

type SortKey = "name" | "category" | "price" | "available";

const sortKey = ref<SortKey>("name");
const sortAsc = ref(true);

function toggleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
}

const products = computed<Product[]>(() => store.state.products);

const sortedProducts = computed<Product[]>(() => {
  const key = sortKey.value;
  const dir = sortAsc.value ? 1 : -1;
  return [...products.value].sort((a, b) => {
    let cmp: number;
    switch (key) {
      case "price":
        cmp = a.price - b.price;
        break;
      case "available":
        cmp = Number(a.available) - Number(b.available);
        break;
      default:
        cmp = a[key].localeCompare(b[key]);
    }
    return cmp * dir;
  });
});

function sortIndicator(key: SortKey): string {
  if (sortKey.value !== key) return "";
  return sortAsc.value ? "▲" : "▼";
}
</script>

<template>
  <main class="px-4 py-1 flex flex-col gap-2 overflow-y-auto">
    <h1 class="text-xl font-semibold mb-1">Products</h1>

    <ul
      class="flex flex-col overflow-y-auto border border-gray-200 rounded-md text-sm"
    >
      <!-- header row -->
      <li
        class="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-4 py-2 bg-gray-50 border-b border-gray-200 font-medium text-gray-600"
      >
        <button
          class="text-left hover:text-gray-900"
          @click="toggleSort('name')"
        >
          Name <span class="text-xs">{{ sortIndicator("name") }}</span>
        </button>
        <button
          class="text-left hover:text-gray-900"
          @click="toggleSort('category')"
        >
          Category <span class="text-xs">{{ sortIndicator("category") }}</span>
        </button>
        <button
          class="text-right hover:text-gray-900"
          @click="toggleSort('price')"
        >
          Price <span class="text-xs">{{ sortIndicator("price") }}</span>
        </button>
        <button
          class="text-right hover:text-gray-900"
          @click="toggleSort('available')"
        >
          Available
          <span class="text-xs">{{ sortIndicator("available") }}</span>
        </button>
      </li>

      <!-- product rows -->
      <ProductRow
        v-for="product in sortedProducts"
        :key="product.id"
        :product="product"
      />
    </ul>
  </main>
</template>
