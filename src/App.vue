<script setup lang="ts">
import ConfirmDialog from "./components/ui/ConfirmDialog.vue";
import MenuBar from "./components/ui/MenuBar.vue";
</script>

<template>
  <div class="w-screen h-screen bg-background flex flex-col">
    <MenuBar />
    <main class="p-4 overflow-auto grow p-4">
      <RouterView />
    </main>
    <ConfirmDialog />
  </div>
</template>
