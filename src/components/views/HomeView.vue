<script setup lang="ts">
import CardPanel from "../CardPanel.vue";
import { useStorage } from "@vueuse/core";
//const collapsed = ref(false)
  const collapsed = useStorage('c1', false)
</script>

<template>
  <main>
    <CardPanel heading="Preferences" :collapsed="collapsed" 
        footer="Manage your preferences" 
        @toggle="collapsed = !collapsed" >
      Lorem ipsum lorem tada.
      Lorem ipsum lorem tada.
      Lorem ipsum lorem tada,
      </CardPanel>

  </main>
</template>
