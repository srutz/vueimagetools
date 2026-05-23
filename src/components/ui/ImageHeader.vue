<script setup lang="ts">
import type { ImageType } from "../../composables/useImages";

defineProps<{
  image: ImageType;
}>();
</script>
<template>
  <div class="flex items-center gap-4 justify-between">
    <p class="truncate text-lg font-semibold text-slate-950">
      {{ image.name }}
    </p>
    <p class="text-sm text-slate-500">
      {{ image.data.width }} x {{ image.data.height }} px
    </p>
  </div>
</template>
