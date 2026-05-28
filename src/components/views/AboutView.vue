<script setup lang="ts">
import WindowIndicator from '../../WindowIndicator.vue';
import BatteryIndicator from '../BatteryIndicator.vue';


</script>

<template>
  <main>
    <BatteryIndicator :segment-count="3 + 12"></BatteryIndicator>
    <WindowIndicator></WindowIndicator>
  </main>
</template>
