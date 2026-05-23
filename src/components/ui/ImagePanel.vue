<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import { useImages, type ImageType } from "../../composables/useImages";
import BaseButton from "./BaseButton.vue";
import ImageToolbox, { type ToolId } from "./ImageToolbox.vue";

const props = defineProps<{
  image: ImageType;
}>();

const images = useImages();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
const activeTool = ref<ToolId | null>("zoom");
const zoom = ref(1);
const pan = ref({ x: 0, y: 0 });

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 32;

// Crop selection is tracked in viewport (client) coordinates so it stays
// correct regardless of the canvas zoom/pan transform.
const cropStart = ref<{ x: number; y: number } | null>(null);
const cropEnd = ref<{ x: number; y: number } | null>(null);
const isSelecting = ref(false);
let cropPointerId: number | null = null;

const selectionStyle = computed(() => {
  const container = containerRef.value;

  if (!cropStart.value || !cropEnd.value || !container) {
    return null;
  }

  const rect = container.getBoundingClientRect();

  return {
    left: `${Math.min(cropStart.value.x, cropEnd.value.x) - rect.left}px`,
    top: `${Math.min(cropStart.value.y, cropEnd.value.y) - rect.top}px`,
    width: `${Math.abs(cropEnd.value.x - cropStart.value.x)}px`,
    height: `${Math.abs(cropEnd.value.y - cropStart.value.y)}px`,
  };
});

const hasSelection = computed(() => {
  if (!cropStart.value || !cropEnd.value) {
    return false;
  }

  return (
    Math.abs(cropEnd.value.x - cropStart.value.x) > 2 &&
    Math.abs(cropEnd.value.y - cropStart.value.y) > 2
  );
});

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

function handleToolClick(tool: ToolId) {
  activeTool.value = activeTool.value === tool ? null : tool;
}

function zoomAt(clientX: number, clientY: number, factor: number) {
  const canvas = canvasRef.value;

  if (!canvas) {
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const oldZoom = zoom.value;
  const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, oldZoom * factor));

  if (newZoom === oldZoom) {
    return;
  }

  const localX = (clientX - rect.left) / oldZoom;
  const localY = (clientY - rect.top) / oldZoom;

  pan.value = {
    x: pan.value.x + localX * (oldZoom - newZoom),
    y: pan.value.y + localY * (oldZoom - newZoom),
  };
  zoom.value = newZoom;
}

function handleCanvasClick(event: MouseEvent) {
  if (activeTool.value !== "zoom") {
    return;
  }

  zoomAt(event.clientX, event.clientY, event.ctrlKey ? 0.5 : 2);
}

function handleCanvasContextMenu(event: MouseEvent) {
  if (activeTool.value !== "zoom") {
    return;
  }

  event.preventDefault();
  zoomAt(event.clientX, event.clientY, 0.5);
}

function clearSelection() {
  cropStart.value = null;
  cropEnd.value = null;
  isSelecting.value = false;
}

function handlePointerDown(event: PointerEvent) {
  if (activeTool.value !== "crop") {
    return;
  }

  event.preventDefault();
  isSelecting.value = true;
  cropStart.value = { x: event.clientX, y: event.clientY };
  cropEnd.value = { x: event.clientX, y: event.clientY };
  cropPointerId = event.pointerId;
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
}

function handlePointerMove(event: PointerEvent) {
  if (!isSelecting.value) {
    return;
  }

  cropEnd.value = { x: event.clientX, y: event.clientY };
}

function handlePointerUp(event: PointerEvent) {
  if (!isSelecting.value) {
    return;
  }

  isSelecting.value = false;

  if (cropPointerId !== null) {
    (event.currentTarget as HTMLElement).releasePointerCapture(cropPointerId);
    cropPointerId = null;
  }

  // Discard accidental clicks that didn't produce a real region.
  if (!hasSelection.value) {
    clearSelection();
  }
}

// Maps a viewport point to a pixel coordinate in the source image, accounting
// for the canvas display size as well as the current zoom/pan transform.
function clientToImage(clientX: number, clientY: number) {
  const canvas = canvasRef.value!;
  const rect = canvas.getBoundingClientRect();

  return {
    x: ((clientX - rect.left) / rect.width) * canvas.width,
    y: ((clientY - rect.top) / rect.height) * canvas.height,
  };
}

async function applyCrop() {
  const canvas = canvasRef.value;

  if (!canvas || !cropStart.value || !cropEnd.value) {
    return;
  }

  const a = clientToImage(cropStart.value.x, cropStart.value.y);
  const b = clientToImage(cropEnd.value.x, cropEnd.value.y);

  let sx = Math.round(Math.min(a.x, b.x));
  let sy = Math.round(Math.min(a.y, b.y));
  let sw = Math.round(Math.abs(b.x - a.x));
  let sh = Math.round(Math.abs(b.y - a.y));

  // Clamp the region to the image bounds.
  sx = Math.max(0, Math.min(sx, canvas.width));
  sy = Math.max(0, Math.min(sy, canvas.height));
  sw = Math.min(sw, canvas.width - sx);
  sh = Math.min(sh, canvas.height - sy);

  if (sw < 1 || sh < 1) {
    clearSelection();
    return;
  }

  const previous = props.image.data;
  const cropped = await createImageBitmap(previous, sx, sy, sw, sh);
  images.updateImage(props.image.id, cropped);
  previous.close();

  clearSelection();
  zoom.value = 1;
  pan.value = { x: 0, y: 0 };
}

onMounted(drawImage);

watch(() => props.image, drawImage, { deep: true });
watch(activeTool, (tool) => {
  if (tool !== "crop") {
    clearSelection();
  }
});
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
    <div
      ref="containerRef"
      class="relative flex min-h-0 grow items-start justify-start overflow-hidden"
    >
      <canvas
        ref="canvasRef"
        :class="[
          'max-h-full max-w-full origin-top-left bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%,transparent_75%,#f8fafc_75%,#f8fafc),linear-gradient(45deg,#f8fafc_25%,transparent_25%,transparent_75%,#f8fafc_75%,#f8fafc)] bg-[length:24px_24px] bg-[position:0_0,12px_12px] shadow-lg',
          activeTool === 'zoom'
            ? 'cursor-zoom-in'
            : activeTool === 'crop'
              ? 'cursor-crosshair'
              : '',
        ]"
        :style="{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }"
        @click="handleCanvasClick"
        @contextmenu="handleCanvasContextMenu"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
        @pointercancel="handlePointerUp"
      />

      <div
        v-if="activeTool === 'crop' && selectionStyle"
        class="pointer-events-none absolute border-2 border-sky-400 bg-sky-400/10"
        :style="selectionStyle"
      />

      <div
        v-if="activeTool === 'crop' && hasSelection && !isSelecting"
        class="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-lg backdrop-blur"
      >
        <BaseButton variant="primary" @click="applyCrop">Apply crop</BaseButton>
        <BaseButton variant="ghost" @click="clearSelection">Cancel</BaseButton>
      </div>

      <ImageToolbox :active-tool="activeTool" @tool-click="handleToolClick" />
    </div>
  </section>
</template>
