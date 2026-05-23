<script setup lang="ts">
import { X } from "@lucide/vue";

defineProps<{
  title: string;
  isActive: boolean;
}>();

const emit = defineEmits<{
  click: [];
  close: [];
}>();
</script>

<template>
  <button
    :title="title"
    class="flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition"
    :class="
      isActive
        ? 'bg-slate-900 text-white'
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
    "
    @click="emit('click')"
  >
    <span class="max-w-48 truncate">{{ title }}</span>
    <span
      class="inline-flex h-5 w-5 items-center justify-center rounded-full transition hover:bg-black/10"
      :class="isActive ? 'hover:bg-white/15' : 'hover:bg-slate-300'"
      @click.stop="emit('close')"
    >
      <X class="h-3.5 w-3.5" />
    </span>
  </button>
</template>
