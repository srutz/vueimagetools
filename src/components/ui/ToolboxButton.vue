<script setup lang="ts">
defineProps<{
  label: string;
  pressed?: boolean;
}>();
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    :title="label"
    :aria-pressed="pressed"
    class="flex h-9 w-9 items-center justify-center rounded-lg transition
           text-slate-600 hover:bg-slate-100 hover:text-slate-900
           aria-pressed:bg-slate-900 aria-pressed:text-white
           disabled:text-slate-300 disabled:cursor-not-allowed disabled:pointer-events-none"
  >
    <slot />
  </button>
</template>
