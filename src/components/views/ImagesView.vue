<script setup lang="ts">
import { computed, ref } from "vue";

import { PlusCircleIcon } from "@lucide/vue";
import { useConfirmDialog } from "../../composables/useConfirmDialog";
import { useImages, type ImageType } from "../../composables/useImages";
import BaseDialog from "../ui/BaseDialog.vue";
import Heading2 from "../ui/Heading-2.vue";
import ImagePanel from "../ui/ImagePanel.vue";
import ImageUploader from "../ui/ImageUploader.vue";
import TabView from "../ui/TabView.vue";

const images = useImages();
const { openConfirmDialog } = useConfirmDialog();

const activeId = ref<string>();

const tabs = computed(() =>
  images.images.map((image) => ({
    id: image.id,
    title: image.name,
    content: ImagePanel,
    props: { image, requestClose: () => handleCloseTab(image.id) },
  })),
);

function closeTab(tabId: string) {
  if (tabId === activeId.value) {
    const index = images.images.findIndex((image) => image.id === tabId);
    activeId.value = (images.images[index + 1] ?? images.images[index - 1])?.id;
  }
  images.removeImage(tabId);
}

function handleCloseTab(tabId?: string) {
  if (!tabId) {
    return;
  }

  const image = images.images.find((i) => i.id === tabId);

  if (image?.dirty) {
    openConfirmDialog(
      "Close image",
      `"${image.name}" has unsaved changes. Close anyway?`,
      () => closeTab(tabId),
    );
    return;
  }

  closeTab(tabId);
}

function handleUploadComplete(uploadedImages: ImageType[]) {
  for (const image of uploadedImages) {
    images.addImage(image);
  }
  // Focus the freshly uploaded image.
  activeId.value = uploadedImages.at(-1)?.id;
  uploadDialogOpen.value = false;
}

const uploadDialogOpen = ref(false);

const handleDialogOpenChange = (value: boolean) => {
  uploadDialogOpen.value = value;
};
</script>

<template>
  <section class="flex h-full min-h-0 flex-col gap-4">
    <div
      v-if="false"
      class="space-y-2 flex items-center justify-between md:flex-row"
    >
      <Heading-2>Images</Heading-2>
      <button
        v-if="tabs.length > 0"
        class="flex items-center gap-2"
        @click="uploadDialogOpen = true"
      >
        Upload more images
        <PlusCircleIcon></PlusCircleIcon>
      </button>
    </div>

    <TabView
      v-if="tabs.length > 0"
      v-model:active-id="activeId"
      :tabs="tabs"
      @close-tab="handleCloseTab($event.id)"
    >
      <template #actionbutton>
        <button
          v-if="tabs.length > 0"
          class="flex items-center gap-2 hover:text-slate-900 text-slate-600 transition hover:bg-slate-200 rounded-xl px-3 py-2 text-sm font-medium"
          @click="uploadDialogOpen = true"
        >
          Upload images
          <PlusCircleIcon></PlusCircleIcon>
        </button>
      </template>
    </TabView>

    <div
      v-else
      class="flex grow items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center text-sm text-slate-500"
    >
      <ImageUploader @upload-complete="handleUploadComplete" />
    </div>
    <BaseDialog
      class="w-[800px] max-w-[90%]"
      title="Upload more images"
      :open="uploadDialogOpen"
      @openchange="handleDialogOpenChange($event)"
    >
      <ImageUploader @upload-complete="handleUploadComplete" />
    </BaseDialog>
  </section>
</template>
