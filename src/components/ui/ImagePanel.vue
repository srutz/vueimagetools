<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";

import { useImages, type ImageType } from "../../composables/useImages";
import BaseButton from "./BaseButton.vue";
import ImageHeader from "./ImageHeader.vue";
import ImagePropsDialog from "./ImagePropsDialog.vue";
import ImageToolbox, { type ToolId } from "./ImageToolbox.vue";

const props = defineProps<{
  image: ImageType;
  requestClose?: () => void;
}>();

const images = useImages();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
const scrollRef = ref<HTMLDivElement | null>(null);
const activeTool = ref<ToolId | null>("zoom");
const infoDialogOpen = ref(false);
const zoom = ref(1);

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 32;

// Scale that makes the image fit the viewport at zoom level 1 (never enlarging
// a small image, mirroring the old `max-w/h-full` behaviour). The displayed
// size is this fit scale multiplied by the user zoom, applied as real CSS
// dimensions so the browser produces native scrollbars when it overflows.
const fitScale = ref(1);

function computeFit() {
  const viewport = scrollRef.value;

  if (!viewport) {
    return;
  }

  const iw = props.image.data.width;
  const ih = props.image.data.height;

  fitScale.value = Math.min(
    viewport.clientWidth / iw,
    viewport.clientHeight / ih,
    1,
  );
}

const canvasStyle = computed(() => {
  const scale = fitScale.value * zoom.value;

  return {
    width: `${props.image.data.width * scale}px`,
    height: `${props.image.data.height * scale}px`,
  };
});

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

// Zooms toward a viewport point, keeping the image pixel under that point
// fixed by adjusting the scroll position once the new size has been laid out.
async function zoomAt(clientX: number, clientY: number, factor: number) {
  const scroller = scrollRef.value;
  const canvas = canvasRef.value;

  if (!scroller || !canvas) {
    return;
  }

  const oldZoom = zoom.value;
  const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, oldZoom * factor));

  if (newZoom === oldZoom) {
    return;
  }

  const before = canvas.getBoundingClientRect();
  const fx = (clientX - before.left) / before.width;
  const fy = (clientY - before.top) / before.height;

  zoom.value = newZoom;
  await nextTick();

  // Where the same fractional point sits now, then nudge scroll so it lands
  // back under the cursor.
  const after = canvas.getBoundingClientRect();
  scroller.scrollLeft += after.left + fx * after.width - clientX;
  scroller.scrollTop += after.top + fy * after.height - clientY;
}

function handleContextMenu(event: MouseEvent) {
  if (activeTool.value !== "zoom") {
    return;
  }

  event.preventDefault();
  zoomAt(event.clientX, event.clientY, 0.5);
}

function handleWheel(event: WheelEvent) {
  // Plain wheel scrolls the viewport natively; Ctrl/Cmd + wheel zooms.
  if (!event.ctrlKey && !event.metaKey) {
    return;
  }

  event.preventDefault();
  zoomAt(event.clientX, event.clientY, event.deltaY < 0 ? 1.1 : 1 / 1.1);
}

// Drag-to-pan and click-to-zoom share the same pointer gesture: a press that
// moves past a small threshold pans, a press that stays put zooms.
const isPanning = ref(false);
let panPointerId: number | null = null;
let panStart: { x: number; y: number; left: number; top: number } | null = null;
let panMoved = false;

function handlePanDown(event: PointerEvent) {
  if (activeTool.value === "crop" || event.button !== 0) {
    return;
  }

  const scroller = scrollRef.value;

  if (!scroller) {
    return;
  }

  panPointerId = event.pointerId;
  panMoved = false;
  panStart = {
    x: event.clientX,
    y: event.clientY,
    left: scroller.scrollLeft,
    top: scroller.scrollTop,
  };
  scroller.setPointerCapture(event.pointerId);
}

function handlePanMove(event: PointerEvent) {
  if (panPointerId === null || !panStart) {
    return;
  }

  const scroller = scrollRef.value!;
  const dx = event.clientX - panStart.x;
  const dy = event.clientY - panStart.y;

  if (!panMoved && Math.hypot(dx, dy) > 4) {
    panMoved = true;
    isPanning.value = true;
  }

  if (panMoved) {
    scroller.scrollLeft = panStart.left - dx;
    scroller.scrollTop = panStart.top - dy;
  }
}

function handlePanUp(event: PointerEvent) {
  if (panPointerId === null) {
    return;
  }

  scrollRef.value?.releasePointerCapture(panPointerId);
  panPointerId = null;
  isPanning.value = false;

  // A press without a real drag is a click: zoom in (or out with Ctrl).
  if (!panMoved && activeTool.value === "zoom") {
    zoomAt(event.clientX, event.clientY, event.ctrlKey ? 0.5 : 2);
  }
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

  clearSelection();
  resetView();
}

function resetView() {
  zoom.value = 1;
  computeFit();

  const scroller = scrollRef.value;

  if (scroller) {
    scroller.scrollLeft = 0;
    scroller.scrollTop = 0;
  }
}

let resizeObserver: ResizeObserver | null = null;

async function applyTransform(
  draw: (ctx: CanvasRenderingContext2D, src: ImageBitmap) => void,
  outWidth: number,
  outHeight: number,
) {
  const canvas = document.createElement("canvas");
  canvas.width = outWidth;
  canvas.height = outHeight;
  draw(canvas.getContext("2d")!, props.image.data);
  const bitmap = await createImageBitmap(canvas);
  images.updateImage(props.image.id, bitmap);
}

function rotateCW() {
  const { width: w, height: h } = props.image.data;
  applyTransform((ctx, src) => {
    ctx.translate(h, 0);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(src, 0, 0);
  }, h, w);
}

function rotateCCW() {
  const { width: w, height: h } = props.image.data;
  applyTransform((ctx, src) => {
    ctx.translate(0, w);
    ctx.rotate(-Math.PI / 2);
    ctx.drawImage(src, 0, 0);
  }, h, w);
}

function flipH() {
  const { width: w, height: h } = props.image.data;
  applyTransform((ctx, src) => {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(src, 0, 0);
  }, w, h);
}

function flipV() {
  const { width: w, height: h } = props.image.data;
  applyTransform((ctx, src) => {
    ctx.translate(0, h);
    ctx.scale(1, -1);
    ctx.drawImage(src, 0, 0);
  }, w, h);
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.ctrlKey && !e.shiftKey && e.key === "z") {
    e.preventDefault();
    images.undoImage(props.image.id);
  } else if (e.ctrlKey && (e.key === "y" || (e.shiftKey && e.key === "Z"))) {
    e.preventDefault();
    images.redoImage(props.image.id);
  }
}

onMounted(() => {
  computeFit();
  drawImage();
  window.addEventListener("keydown", handleKeyDown);

  const viewport = scrollRef.value;

  if (viewport) {
    resizeObserver = new ResizeObserver(computeFit);
    resizeObserver.observe(viewport);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  window.removeEventListener("keydown", handleKeyDown);
});

watch(
  () => props.image,
  () => {
    drawImage();
    resetView();
  },
  { deep: true },
);
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
    <ImageHeader :image="image" @close="props.requestClose?.()" />
    <div ref="containerRef" class="relative flex min-h-0 grow overflow-hidden">
      <div
        ref="scrollRef"
        :class="[
          'absolute inset-0 flex overflow-auto [align-items:safe_center] [justify-content:safe_center]',
          activeTool === 'crop'
            ? 'cursor-crosshair'
            : isPanning
              ? 'cursor-grabbing'
              : activeTool === 'zoom'
                ? 'cursor-zoom-in'
                : 'cursor-grab',
        ]"
        @pointerdown="handlePanDown"
        @pointermove="handlePanMove"
        @pointerup="handlePanUp"
        @pointercancel="handlePanUp"
        @contextmenu="handleContextMenu"
        @wheel="handleWheel"
      >
        <canvas
          ref="canvasRef"
          class="m-auto shrink-0 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%,transparent_75%,#f8fafc_75%,#f8fafc),linear-gradient(45deg,#f8fafc_25%,transparent_25%,transparent_75%,#f8fafc_75%,#f8fafc)] bg-[length:24px_24px] bg-[position:0_0,12px_12px] shadow-lg"
          :style="canvasStyle"
          @pointerdown="handlePointerDown"
          @pointermove="handlePointerMove"
          @pointerup="handlePointerUp"
          @pointercancel="handlePointerUp"
        />
      </div>

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

      <ImageToolbox
        :active-tool="activeTool"
        :can-undo="props.image.undoStack.length > 0"
        :can-redo="props.image.redoStack.length > 0"
        @tool-click="handleToolClick"
        @undo="images.undoImage(props.image.id)"
        @redo="images.redoImage(props.image.id)"
        @rotate-cw="rotateCW"
        @rotate-ccw="rotateCCW"
        @flip-h="flipH"
        @flip-v="flipV"
        @info="infoDialogOpen = true"
      />
    </div>

    <ImagePropsDialog
      :open="infoDialogOpen"
      :image="props.image"
      @openchange="infoDialogOpen = $event"
    />
  </section>
</template>
