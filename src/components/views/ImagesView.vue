<script setup lang="ts">
import { computed } from "vue";

import { useImages } from "../../composables/useImages";
import Heading2 from "../ui/Heading-2.vue";
import ImagePanel from "../ui/ImagePanel.vue";
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
</script>

<template>
  <section class="flex h-full min-h-0 flex-col gap-4">
    <div class="space-y-2">
      <Heading-2>Images</Heading-2>
    </div>

    <TabView
      v-if="tabs.length > 0"
      :tabs="tabs"
      @close-tab="handleCloseTab($event.id)"
    />

    <div
      v-else
      class="flex grow items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center text-sm text-slate-500"
    >
      Upload images first to populate this view.
    </div>
  </section>
</template>
