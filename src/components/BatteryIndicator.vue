<script lang="ts" setup>
import { computed } from 'vue';
import { useBattery } from '@vueuse/core';
import { Zap } from '@lucide/vue';

const { level, charging } = useBattery();

const { segmentCount = 20 } = defineProps<{
  segmentCount?: number;
}>();

const segments = computed(() =>
  Array.from({ length: segmentCount }, (_, i) => {
    const active = level.value * segmentCount > i;
    let color = 'bg-green-500';
    if (i < 2) color = 'bg-red-500';
    else if (i < 5) color = 'bg-yellow-400';
    return { active, color };
  }),
);

const percent = computed(() => Math.round(level.value * 100));
</script>

<template>
  <div class="flex flex-col gap-1">
    <div
      class="flex items-center gap-[2px] rounded-sm border border-gray-400 bg-gray-100 p-[2px]"
      style="width: 128px; height: 32px"
    >
      <div
        v-for="(seg, i) in segments"
        :key="i"
        class="h-full flex-1 rounded-[1px] transition-colors"
        :class="seg.active ? seg.color : 'bg-gray-300'"
      />
    </div>
    <div class="flex items-center gap-1 text-sm">
      <Zap v-if="charging" class="h-4 w-4 text-green-600" />
      <span>{{ charging ? 'Charging' : 'Not charging' }} · {{ percent }}%</span>
    </div>
  </div>
</template>
