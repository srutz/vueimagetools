<script setup lang="ts">
import { Crop, GripVertical, Redo2, Undo2, ZoomIn } from "@lucide/vue";
import { ref } from "vue";

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

function selectTool(id: ToolId) {
  emit("tool-click", id);
}

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
    <button
      v-for="tool in tools"
      :key="tool.id"
      type="button"
      :title="tool.label"
      :aria-label="tool.label"
      :aria-pressed="activeTool === tool.id"
      class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 aria-pressed:bg-slate-900 aria-pressed:text-white"
      @click="selectTool(tool.id)"
    >
      <component :is="tool.icon" class="h-5 w-5" />
    </button>
    <hr class="border-slate-200 mx-1" />
    <button
      type="button"
      :disabled="!canUndo"
      title="Undo (Ctrl+Z)"
      aria-label="Undo"
      :class="[
        'flex h-9 w-9 items-center justify-center rounded-lg transition',
        canUndo
          ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          : 'text-slate-300 cursor-not-allowed',
      ]"
      @click="emit('undo')"
    >
      <Undo2 class="h-5 w-5" />
    </button>
    <button
      type="button"
      :disabled="!canRedo"
      title="Redo (Ctrl+Y)"
      aria-label="Redo"
      :class="[
        'flex h-9 w-9 items-center justify-center rounded-lg transition',
        canRedo
          ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          : 'text-slate-300 cursor-not-allowed',
      ]"
      @click="emit('redo')"
    >
      <Redo2 class="h-5 w-5" />
    </button>
  </div>
</template>
