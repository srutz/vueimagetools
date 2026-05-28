<script setup lang="ts">
import { Crop, FlipHorizontal2, FlipVertical2, GripVertical, Info, Redo2, RotateCcw, RotateCw, Undo2, ZoomIn } from "@lucide/vue";
import { ref } from "vue";
import ToolboxButton from "./ToolboxButton.vue";

export type ToolId = "zoom" | "crop";

defineProps<{
  activeTool: ToolId | null;
  canUndo: boolean;
  canRedo: boolean;
}>();

const emit = defineEmits<{
  (e: "tool-click", tool: ToolId): void;
  (e: "undo"): void;
  (e: "redo"): void;
  (e: "rotate-cw"): void;
  (e: "rotate-ccw"): void;
  (e: "flip-h"): void;
  (e: "flip-v"): void;
  (e: "info"): void;
}>();

const tools: { id: ToolId; label: string; icon: typeof ZoomIn }[] = [
  { id: "zoom", label: "Zoom", icon: ZoomIn },
  { id: "crop", label: "Crop", icon: Crop },
];

const rootRef = ref<HTMLDivElement | null>(null);
const position = ref({ x: 16, y: 16 });
const dragging = ref(false);
let pointerId: number | null = null;
let offsetX = 0;
let offsetY = 0;

function onPointerDown(event: PointerEvent) {
  const root = rootRef.value;
  const rect = root?.getBoundingClientRect();

  if (!root || !rect) {
    return;
  }

  offsetX = event.clientX - rect.left;
  offsetY = event.clientY - rect.top;
  dragging.value = true;
  pointerId = event.pointerId;
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value) {
    return;
  }

  const root = rootRef.value;
  const container = root?.parentElement;

  if (!root || !container) {
    return;
  }

  const bounds = container.getBoundingClientRect();
  const maxX = Math.max(0, container.clientWidth - root.offsetWidth);
  const maxY = Math.max(0, container.clientHeight - root.offsetHeight);

  position.value = {
    x: Math.min(maxX, Math.max(0, event.clientX - bounds.left - offsetX)),
    y: Math.min(maxY, Math.max(0, event.clientY - bounds.top - offsetY)),
  };
}

function onPointerUp(event: PointerEvent) {
  if (!dragging.value) {
    return;
  }

  dragging.value = false;

  if (pointerId !== null) {
    (event.currentTarget as HTMLElement).releasePointerCapture(pointerId);
    pointerId = null;
  }
}
</script>

<template>
  <div
    ref="rootRef"
    class="absolute z-10 flex flex-col gap-1 rounded-xl border border-slate-300 bg-white/95 p-1 shadow-2xl backdrop-blur select-none"
    :style="{ left: `${position.x}px`, top: `${position.y}px` }"
    role="toolbar"
    aria-label="Image tools"
  >
    <button
      type="button"
      :class="[
        'flex h-6 w-9 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700',
        dragging ? 'cursor-grabbing' : 'cursor-grab',
      ]"
      title="Drag toolbox"
      aria-label="Drag toolbox"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <GripVertical class="h-4 w-4 rotate-90" />
    </button>

    <ToolboxButton
      v-for="tool in tools"
      :key="tool.id"
      :label="tool.label"
      :pressed="activeTool === tool.id"
      @click="emit('tool-click', tool.id)"
    >
      <component :is="tool.icon" class="h-5 w-5" />
    </ToolboxButton>

    <hr class="border-slate-200 mx-1" />

    <ToolboxButton label="Undo (Ctrl+Z)" :disabled="!canUndo" @click="emit('undo')">
      <Undo2 class="h-5 w-5" />
    </ToolboxButton>
    <ToolboxButton label="Redo (Ctrl+Y)" :disabled="!canRedo" @click="emit('redo')">
      <Redo2 class="h-5 w-5" />
    </ToolboxButton>

    <hr class="border-slate-200 mx-1" />

    <ToolboxButton label="Rotate clockwise" @click="emit('rotate-cw')">
      <RotateCw class="h-5 w-5" />
    </ToolboxButton>
    <ToolboxButton label="Rotate counter-clockwise" @click="emit('rotate-ccw')">
      <RotateCcw class="h-5 w-5" />
    </ToolboxButton>
    <ToolboxButton label="Flip horizontal" @click="emit('flip-h')">
      <FlipHorizontal2 class="h-5 w-5" />
    </ToolboxButton>
    <ToolboxButton label="Flip vertical" @click="emit('flip-v')">
      <FlipVertical2 class="h-5 w-5" />
    </ToolboxButton>

    <hr class="border-slate-200 mx-1" />

    <ToolboxButton label="Image properties" @click="emit('info')">
      <Info class="h-5 w-5" />
    </ToolboxButton>
  </div>
</template>
