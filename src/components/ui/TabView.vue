<script lang="ts" setup>
import { X } from "@lucide/vue";
import { computed, watch, type Component } from "vue";

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
    <div
      class="shrink-0 flex items-center gap-2 border-b border-slate-200 px-3 py-3 overflow-x-auto"
    >
      <button
        v-for="(tab, index) in tabs"
        :key="tab.id"
        :title="tab.title"
        class="flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition"
        :class="
          tab.id === activeId
            ? 'bg-slate-900 text-white'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
        "
        @click="activeId = tab.id"
      >
        <span class="max-w-48 truncate">{{ tab.title }}</span>
        <span
          class="inline-flex h-5 w-5 items-center justify-center rounded-full transition hover:bg-black/10"
          :class="
            tab.id === activeId ? 'hover:bg-white/15' : 'hover:bg-slate-300'
          "
          @click.stop="handleCloseTab(tab, index)"
        >
          <X class="h-3.5 w-3.5" />
        </span>
      </button>
    </div>

    <div v-if="activeTab" class="grow overflow-auto">
      <component :is="activeTab.content" v-bind="activeTab.props ?? {}" />
    </div>

    <div
      v-else
      class="flex grow items-center justify-center px-6 py-16 text-center text-sm text-slate-500"
    >
      No tabs available.
    </div>
  </div>
</template>
