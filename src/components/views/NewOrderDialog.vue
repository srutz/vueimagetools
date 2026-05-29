<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useStore } from "../../store";
import type { OrderLine, Product } from "../../store/types";
import BaseDialog from "../ui/BaseDialog.vue";

const store = useStore();

const open = defineModel<boolean>({ default: false });

const availableProducts = computed<Product[]>(
  () => store.getters.availableProducts,
);

const table = ref("");
// productId -> quantity
const quantities = ref<Record<string, number>>({});

// Reset the form each time the dialog opens.
watch(open, (isOpen) => {
  if (isOpen) {
    table.value = "";
    quantities.value = {};
  }
});

function inc(id: string) {
  quantities.value[id] = (quantities.value[id] ?? 0) + 1;
}

function dec(id: string) {
  const next = (quantities.value[id] ?? 0) - 1;
  if (next <= 0) delete quantities.value[id];
  else quantities.value[id] = next;
}

const lines = computed<OrderLine[]>(() =>
  Object.entries(quantities.value).map(([productId, quantity]) => ({
    productId,
    quantity,
  })),
);

const canSubmit = computed(
  () => table.value.trim().length > 0 && lines.value.length > 0,
);

function submit() {
  if (!canSubmit.value) return;
  store.dispatch("placeOrder", {
    table: table.value.trim(),
    lines: lines.value,
  });
  open.value = false;
}
</script>

<template>
  <BaseDialog :open="open" title="New order" @openchange="open = !open">
    <div class="flex flex-col gap-4">
      <label class="flex flex-col gap-1 text-sm">
        <span class="text-gray-600">Table</span>
        <input
          v-model="table"
          type="text"
          placeholder="e.g. 5 or takeaway"
          class="border border-gray-300 rounded-md px-2 py-1"
        />
      </label>

      <div class="flex flex-col gap-1 text-sm">
        <span class="text-gray-600">Items</span>
        <ul class="border border-gray-200 rounded-md max-h-64 overflow-y-auto">
          <li
            v-for="product in availableProducts"
            :key="product.id"
            class="flex items-center justify-between gap-2 px-3 py-1.5 border-b border-gray-100 last:border-b-0"
          >
            <span class="truncate">{{ product.name }}</span>
            <span class="flex items-center gap-2">
              <button
                type="button"
                class="w-6 h-6 rounded border border-gray-300 hover:bg-gray-100 leading-none"
                @click="dec(product.id)"
              >
                −
              </button>
              <span class="w-5 text-center tabular-nums">
                {{ quantities[product.id] ?? 0 }}
              </span>
              <button
                type="button"
                class="w-6 h-6 rounded border border-gray-300 hover:bg-gray-100 leading-none"
                @click="inc(product.id)"
              >
                +
              </button>
            </span>
          </li>
        </ul>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <button
          type="button"
          class="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 text-sm"
          @click="open = false"
        >
          Cancel
        </button>
        <button
          type="button"
          :disabled="!canSubmit"
          class="px-3 py-1 rounded-md bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed"
          @click="submit()"
        >
          Place order
        </button>
      </div>
    </div>
  </BaseDialog>
</template>
