<script setup lang="ts">
import { useTitle } from "@vueuse/core";
import WindowIndicator from "../../WindowIndicator.vue";
import BatteryIndicator from "../BatteryIndicator.vue";
import ShadowBox from "../ShadowBox.vue";

useTitle("About World");
</script>

<template>
  <main>
    <ShadowBox>
      <BatteryIndicator :segment-count="3 + 12"></BatteryIndicator>
    </ShadowBox>
    <ShadowBox>
      <WindowIndicator></WindowIndicator>
    </ShadowBox>
  </main>
</template>
