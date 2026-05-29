<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "../../store";
import type { Product } from "../../store/types";

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

function toggleAvailability(product: Product) {
  store.commit("setProductAvailability", {
    productId: product.id,
    available: !product.available,
  });
}

function sortIndicator(key: SortKey): string {
  if (sortKey.value !== key) return "";
  return sortAsc.value ? "▲" : "▼";
}

const eur = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});
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
      <li
        v-for="product in sortedProducts"
        :key="product.id"
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
            @click="toggleAvailability(product)"
          >
            {{ product.available ? "Available" : "Sold out" }}
          </button>
        </div>
      </li>
    </ul>
  </main>
</template>
