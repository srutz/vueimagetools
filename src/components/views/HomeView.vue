<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { onMounted, ref } from "vue";
import CardPanel from "../CardPanel.vue";
import CheckBox from "../CheckBox.vue";

const collapsed = useStorage("c1", false);
// relevant ende
onMounted(() => {
  console.log("HomeView mounted");
});

const simpleMode = ref(false);
</script>

<template>
  <main>
    <div class="flex gap-4">
      <CheckBox
        id="sm"
        :checked="simpleMode"
        @checked="simpleMode = !simpleMode"
      ></CheckBox>
      <label for="sm">Simple Mode</label>
    </div>
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
