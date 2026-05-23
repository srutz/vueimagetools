<script setup lang="ts">
import { CheckCircle2, ImagePlus, LoaderCircle, Upload } from "@lucide/vue";
import { computed, ref } from "vue";

import type { ImageType } from "../../composables/useImages";

const emit = defineEmits<{
  uploadComplete: [images: ImageType[]];
}>();

const isDragging = ref(false);
const isUploading = ref(false);
const errorMessage = ref("");
const lastUploadedNames = ref<string[]>([]);

const statusLabel = computed(() => {
  if (isUploading.value) {
    return "Processing images...";
  }

  if (lastUploadedNames.value.length > 0) {
    return `${lastUploadedNames.value.length} image${lastUploadedNames.value.length > 1 ? "s" : ""} ready`;
  }

  return "PNG, JPG, GIF, WebP, BMP and SVG supported";
});

function setDragging(value: boolean) {
  isDragging.value = value;
}

async function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement;
  await processFiles(target.files);
  target.value = "";
}

async function handleDrop(event: DragEvent) {
  setDragging(false);
  await processFiles(event.dataTransfer?.files ?? null);
}

async function processFiles(fileList: FileList | null) {
  if (!fileList || fileList.length === 0 || isUploading.value) {
    return;
  }

  errorMessage.value = "";
  isUploading.value = true;

  try {
    const imageFiles = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (imageFiles.length === 0) {
      errorMessage.value = "Select at least one valid image file.";
      lastUploadedNames.value = [];
      return;
    }

    const uploadedImages = await Promise.all(
      imageFiles.map(async (file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        data: await createImageBitmap(file),
      })),
    );

    lastUploadedNames.value = uploadedImages.map((image) => image.name);
    emit("uploadComplete", uploadedImages);
  } catch {
    errorMessage.value = "The selected files could not be processed.";
    lastUploadedNames.value = [];
  } finally {
    isUploading.value = false;
  }
}
</script>

<template>
  <section class="mx-auto w-full max-w-3xl">
    <div
      class="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-linear-to-br from-white via-slate-50 to-sky-100 p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)] transition-all duration-300 sm:p-8"
      :class="{
        'border-sky-400 shadow-[0_28px_90px_-32px_rgba(14,165,233,0.45)] ring-4 ring-sky-200/70':
          isDragging,
      }"
      @dragenter.prevent="setDragging(true)"
      @dragover.prevent="setDragging(true)"
      @dragleave.prevent="setDragging(false)"
      @drop.prevent="handleDrop"
    >
      <div
        class="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-white/80 to-transparent"
      />

      <div class="relative flex flex-col gap-6">
        <div
          class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <div class="max-w-xl space-y-3">
            <div
              class="inline-flex w-fit items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-white uppercase"
            >
              <ImagePlus class="h-4 w-4" />
              Upload Images
            </div>

            <div class="space-y-2">
              <p class="text-sm leading-6 text-slate-600 sm:text-base">
                Drop one or more images anywhere in this card, or browse your
                files. Uploaded images are added to the app as soon as
                processing finishes.
              </p>
            </div>
          </div>
        </div>

        <label
          class="group relative flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-white/80 px-6 py-10 text-center transition duration-300 hover:border-sky-400 hover:bg-sky-50/80"
          :class="{
            'border-sky-500 bg-sky-50/90': isDragging,
            'cursor-progress': isUploading,
          }"
        >
          <input
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            :disabled="isUploading"
            @change="handleInputChange"
          />

          <div
            class="mb-5 flex h-18 w-18 items-center justify-center rounded-3xl bg-slate-950 text-white shadow-lg shadow-slate-300/60 transition group-hover:scale-105"
          >
            <LoaderCircle v-if="isUploading" class="h-8 w-8 animate-spin" />
            <Upload v-else class="h-8 w-8" />
          </div>

          <div class="space-y-3">
            <p class="text-xl font-semibold text-slate-900">
              {{ isUploading ? "Uploading your images" : "Drop images here" }}
            </p>
            <p class="text-sm text-slate-500 sm:text-base">
              {{
                isUploading
                  ? "Please wait while each file is decoded."
                  : "or click to browse from your device"
              }}
            </p>
          </div>

          <div
            class="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600 sm:text-sm"
          >
            <CheckCircle2 class="h-4 w-4 text-emerald-500" />
            {{ statusLabel }}
          </div>
        </label>

        <p v-if="errorMessage" class="text-sm font-medium text-rose-600">
          {{ errorMessage }}
        </p>

        <div v-if="lastUploadedNames.length > 0" class="space-y-3">
          <p
            class="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase"
          >
            Latest Upload
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="name in lastUploadedNames"
              :key="name"
              class="rounded-full border border-sky-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm"
            >
              {{ name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
