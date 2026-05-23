<script setup lang="ts">
import { computed, ref } from "vue";

import { PlusCircleIcon } from "@lucide/vue";
import { useImages, type ImageType } from "../../composables/useImages";
import BaseDialog from "../ui/BaseDialog.vue";
import Heading2 from "../ui/Heading-2.vue";
import ImagePanel from "../ui/ImagePanel.vue";
import ImageUploader from "../ui/ImageUploader.vue";
import TabView from "../ui/TabView.vue";

const images = useImages();

const tabs = computed(() =>
  images.images.map((image) => ({
    id: image.id,
    title: image.name,
    content: ImagePanel,
    props: { image },
  })),
);

function handleCloseTab(tabId?: string) {
  if (!tabId) {
    return;
  }

  images.removeImage(tabId);
}

function handleUploadComplete(uploadedImages: ImageType[]) {
  for (const image of uploadedImages) {
    images.addImage(image);
  }
}

const uploadDialogOpen = ref(false);

const handleDialogOpenChange = (value: boolean) => {
  uploadDialogOpen.value = value;
};
</script>

<template>
  <section class="flex h-full min-h-0 flex-col gap-4">
    <div class="space-y-2 flex items-center justify-between md:flex-row">
      <Heading-2>Images</Heading-2>
      <button
        v-if="tabs.length > 0"
        class="flex items-center gap-2"
        @click="uploadDialogOpen = true"
      >
        Upload more images
        <PlusCircleIcon></PlusCircleIcon>
      </button>
      <BaseDialog
        title="Upload more images"
        :open="uploadDialogOpen"
        @openchange="handleDialogOpenChange($event)"
      >
        <ImageUploader @upload-complete="handleUploadComplete" />
      </BaseDialog>
    </div>

    <TabView
      v-if="tabs.length > 0"
      :tabs="tabs"
      @close-tab="handleCloseTab($event.id)"
    />

    <div
      v-else
      i
      class="flex grow items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center text-sm text-slate-500"
    >
      <ImageUploader @upload-complete="handleUploadComplete" />
    </div>
  </section>
</template>
