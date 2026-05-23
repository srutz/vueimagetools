<script setup lang="ts">
import { X } from "@lucide/vue";
import { twMerge } from "tailwind-merge";
import { computed, onUnmounted, useAttrs, useId, watch } from "vue";

const props = defineProps<{
  open: boolean;
  title: string;
}>();

const emit = defineEmits<{
  openchange: [open: boolean];
}>();

// Opt out of automatic fallthrough so a passed `class` merges onto the dialog
// panel (Tailwind-aware: conflicting utilities are deduped, the passed class
// wins) rather than landing on the backdrop.
defineOptions({ inheritAttrs: false });

const attrs = useAttrs();

const panelClasses = computed(() =>
  twMerge(
    "flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl",
    attrs.class as string,
  ),
);

// Forward everything except `class`, which we handle above.
const forwardedAttrs = computed(() => {
  const rest = { ...attrs };
  delete rest.class;
  return rest;
});

const titleId = useId();

function close() {
  emit("openchange", false);
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    close();
  }
}

// Listen for Escape and lock body scroll only while the dialog is open.
watch(
  () => props.open,
  (open) => {
    if (open) {
      window.addEventListener("keydown", handleKeydown);
      document.body.style.overflow = "hidden";
    } else {
      window.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = "";
    }
  },
);

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
      @click.self="close"
    >
      <div
        :class="panelClasses"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        v-bind="forwardedAttrs"
      >
        <div
          class="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4"
        >
          <h2 :id="titleId" class="text-lg font-semibold text-slate-950">
            {{ title }}
          </h2>
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
            @click="close"
          >
            <X class="h-5 w-5" />
          </button>
        </div>
        <div class="overflow-auto p-5">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
