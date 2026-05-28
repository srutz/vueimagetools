<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';
import BatteryIndicator from '../BatteryIndicator.vue';


const { width, height } = useWindowSize();


</script>

<template>
  <main>
    <BatteryIndicator :segment-count="3 + 12"></BatteryIndicator>

    {{ width }} x {{  height }}
    <div v-if="height < 240">
      Wenig Platz
    </div>
  </main>
</template>
