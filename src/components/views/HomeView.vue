<script setup lang="ts">
import { ref } from "vue";
import CardPanel from "../CardPanel.vue";
const collapsed = ref(false)
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
