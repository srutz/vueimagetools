<script setup lang="ts">
import { Download, Menu, X } from "@lucide/vue";
import { onUnmounted, ref } from "vue";
import type { ImageType } from "../../composables/useImages";

const props = defineProps<{
  image: ImageType;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const menuOpen = ref(false);

function openMenu() {
  menuOpen.value = true;
  document.addEventListener("mousedown", onClickOutside);
}

function closeMenu() {
  menuOpen.value = false;
  document.removeEventListener("mousedown", onClickOutside);
}

function toggleMenu() {
  if (menuOpen.value) {
    closeMenu();
  } else {
    openMenu();
  }
}

const menuRef = ref<HTMLDivElement | null>(null);

function onClickOutside(e: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    closeMenu();
  }
}

onUnmounted(() => {
  document.removeEventListener("mousedown", onClickOutside);
});

async function saveImage() {
  closeMenu();
  const canvas = document.createElement("canvas");
  canvas.width = props.image.data.width;
  canvas.height = props.image.data.height;
  canvas.getContext("2d")!.drawImage(props.image.data, 0, 0);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = props.image.name.replace(/\.[^.]+$/, "") + ".png";
    a.click();
    URL.revokeObjectURL(url);
  });
}

function closeImage() {
  closeMenu();
  emit("close");
}
</script>

<template>
  <div class="flex items-center gap-3 justify-between">
    <div class="flex items-center gap-2 min-w-0">
      <div ref="menuRef" class="relative shrink-0">
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
          :aria-expanded="menuOpen"
          aria-label="File menu"
          @click="toggleMenu"
        >
          <Menu class="h-4 w-4" />
        </button>

        <div
          v-if="menuOpen"
          class="absolute top-full left-0 z-20 mt-1 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
          role="menu"
        >
          <button
            type="button"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
            role="menuitem"
            @click="saveImage"
          >
            <Download class="h-4 w-4 shrink-0" />
            Save
          </button>
          <button
            type="button"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
            role="menuitem"
            @click="closeImage"
          >
            <X class="h-4 w-4 shrink-0" />
            Close
          </button>
        </div>
      </div>

      <p
        class="flex items-center gap-2 truncate text-lg font-semibold text-slate-950"
      >
        <span
          v-if="image.dirty"
          class="h-2 w-2 shrink-0 rounded-full bg-amber-400"
          title="Unsaved changes"
        />
        {{ image.name }}
      </p>
    </div>

    <p class="shrink-0 text-sm text-slate-500">
      {{ image.data.width }} x {{ image.data.height }} px
    </p>
  </div>
</template>
