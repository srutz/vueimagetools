<script lang="ts" setup>
import { computed, watch, type Component } from "vue";
import TabButton from "./TabButton.vue";

type Tab = {
  id: string;
  title: string;
  content: Component;
  props?: Record<string, unknown>;
};

const props = defineProps<{
  tabs: Tab[];
}>();

// Which tab is active is controlled by the parent (by stable id, since indices
// shift as tabs are added/removed). Use `v-model:active-id`.
const activeId = defineModel<string>("activeId");

const emit = defineEmits<{
  closeTab: [tab: Tab, index: number];
}>();

const activeTab = computed(
  () => props.tabs.find((tab) => tab.id === activeId.value) ?? null,
);

function handleCloseTab(tab: Tab, index: number) {
  emit("closeTab", tab, index);
}

// Self-heal: when the model is unset or points at a tab that no longer exists
// (first render, or a stale id), fall back to the first tab so something is
// always selected. Neighbour selection on close is the parent's job.
watch(
  [() => props.tabs, activeId],
  ([tabs, id]) => {
    if (tabs.length > 0 && !tabs.some((tab) => tab.id === id)) {
      activeId.value = tabs[0].id;
    }
  },
  { immediate: true },
);
</script>
<template>
  <div
    class="flex grow flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
  >
    <div class="flex gap-2 justify-between items-center mr-2">
      <div
        class="shrink-0 flex items-center gap-2 border-b border-slate-200 px-3 py-3 overflow-x-auto"
      >
        <TabButton
          v-for="(tab, index) in tabs"
          :key="tab.id"
          :title="tab.title"
          :is-active="tab.id === activeId"
          @click="activeId = tab.id"
          @close="handleCloseTab(tab, index)"
        />
      </div>
      <slot name="actionbutton"></slot>
    </div>

    <div v-if="activeTab" class="grow overflow-auto">
      <component :is="activeTab.content" v-bind="activeTab.props ?? {}" />
    </div>

    <div
      v-else
      class="flex grow items-center justify-center px-6 py-16 text-center text-sm text-slate-500"
    ></div>
  </div>
</template>
