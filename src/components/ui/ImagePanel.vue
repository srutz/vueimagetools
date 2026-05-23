<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

import type { ImageType } from "../../composables/useImages";

const props = defineProps<{
  image: ImageType;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);

function drawImage() {
  const canvas = canvasRef.value;

  if (!canvas) {
    return;
  }

  canvas.width = props.image.data.width;
  canvas.height = props.image.data.height;

  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(props.image.data, 0, 0);
}

onMounted(drawImage);

watch(() => props.image, drawImage, { deep: true });
</script>
<template>
  <section
    class="flex h-full flex-col gap-4 bg-slate-50 p-2 sm:p-6 justify-start"
  >
    <div class="flex items-center gap-4 justify-between">
      <p class="truncate text-lg font-semibold text-slate-950">
        {{ image.name }}
      </p>
      <p class="text-sm text-slate-500">
        {{ image.data.width }} x {{ image.data.height }} px
      </p>
    </div>
    <canvas
      ref="canvasRef"
      class="max-h-full max-w-full bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%,transparent_75%,#f8fafc_75%,#f8fafc),linear-gradient(45deg,#f8fafc_25%,transparent_25%,transparent_75%,#f8fafc_75%,#f8fafc)] bg-[length:24px_24px] bg-[position:0_0,12px_12px] shadow-lg"
    />
  </section>
</template>
