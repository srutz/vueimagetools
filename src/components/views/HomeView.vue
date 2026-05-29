<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { onMounted } from "vue";
import CardPanel from "../CardPanel.vue";

const collapsed = useStorage("c1", false);
// relevant ende
onMounted(() => {
  console.log("HomeView mounted");
});
</script>

<template>
  <main>
    <CardPanel
      heading="Preferences"
      :collapsed="collapsed"
      footer="Manage your preferences"
      @toggle="collapsed = !collapsed"
    >
      Lorem ipsum lorem tada. Lorem ipsum lorem tada. Lorem ipsum lorem tada,
    </CardPanel>
  </main>
</template>
