<script setup lang="ts">
import { useRouter } from "vue-router";

import type { ImageType } from "../../composables/useImages";
import { useImages } from "../../composables/useImages";
import Heading1 from "../ui/Heading-1.vue";
import Heading2 from "../ui/Heading-2.vue";
import ImageUploader from "../ui/ImageUploader.vue";

const images = useImages();
const router = useRouter();

function handleUploadComplete(uploadedImages: ImageType[]) {
  for (const image of uploadedImages) {
    images.addImage(image);
  }

  if (uploadedImages.length > 0) {
    router.push("/images");
  }
}
</script>

<template>
  <main class="space-y-6">
    <Heading-2>Home</Heading-2>
    <Heading-1>Image Tools</Heading-1>

    <ImageUploader @upload-complete="handleUploadComplete" />

    <p class="text-sm text-slate-500">
      {{ images.images.length }} image{{
        images.images.length === 1 ? "" : "s"
      }}
      currently in store.
    </p>
  </main>
</template>
