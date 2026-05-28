<script setup lang="ts">
import { ref } from "vue";
import CardPanel from "../CardPanel.vue";
const collapsed = ref(false)
const collapsed2 = ref(false)
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
    <CardPanel heading="Preferences" :collapsed="collapsed2" 
        footer="Manage your preferences" 
        @toggle="collapsed2 = !collapsed2" >
       Second panes
      </CardPanel>

  </main>
</template>
