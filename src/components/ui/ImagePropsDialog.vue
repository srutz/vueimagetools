<script setup lang="ts">
import { computed } from "vue";
import type { ImageType } from "../../composables/useImages";
import BaseDialog from "./BaseDialog.vue";

const props = defineProps<{
  open: boolean;
  image: ImageType;
}>();

const emit = defineEmits<{
  openchange: [open: boolean];
}>();

function getFormat(name: string, mimeType?: string): string {
  if (mimeType) {
    const mimeMap: Record<string, string> = {
      "image/jpeg": "JPEG",
      "image/png": "PNG",
      "image/gif": "GIF",
      "image/webp": "WebP",
      "image/bmp": "BMP",
      "image/svg+xml": "SVG",
      "image/avif": "AVIF",
      "image/tiff": "TIFF",
    };
    if (mimeMap[mimeType]) return mimeMap[mimeType];
  }
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const extMap: Record<string, string> = {
    jpg: "JPEG",
    jpeg: "JPEG",
    png: "PNG",
    gif: "GIF",
    webp: "WebP",
    bmp: "BMP",
    svg: "SVG",
    avif: "AVIF",
    tiff: "TIFF",
    tif: "TIFF",
  };
  return extMap[ext] ?? "Unknown";
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function aspectRatio(w: number, h: number): string {
  const d = gcd(w, h);
  const rw = w / d;
  const rh = h / d;
  if (rw > 100 || rh > 100) {
    return `${(w / h).toFixed(2)}:1`;
  }
  return `${rw}:${rh}`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const rows = computed(() => {
  const { image } = props;
  const w = image.data.width;
  const h = image.data.height;
  const format = getFormat(image.name, image.mimeType);

  const items: { label: string; value: string }[] = [
    { label: "Name", value: image.name },
    { label: "Format", value: format },
    { label: "Width", value: `${w} px` },
    { label: "Height", value: `${h} px` },
    { label: "Megapixels", value: `${(w * h / 1_000_000).toFixed(2)} MP` },
    { label: "Aspect ratio", value: aspectRatio(w, h) },
  ];

  if (image.fileSize !== undefined) {
    items.push({ label: "File size", value: formatFileSize(image.fileSize) });
  }

  return items;
});
</script>

<template>
  <BaseDialog
    :open="open"
    title="Image properties"
    class="max-w-sm"
    @openchange="emit('openchange', $event)"
  >
    <table class="w-full text-sm">
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.label"
          class="border-b border-slate-100 last:border-0"
        >
          <td class="py-2.5 pr-6 font-medium text-slate-500 whitespace-nowrap">
            {{ row.label }}
          </td>
          <td class="py-2.5 text-slate-900 font-mono break-all">
            {{ row.value }}
          </td>
        </tr>
      </tbody>
    </table>
  </BaseDialog>
</template>
