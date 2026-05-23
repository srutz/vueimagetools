<script lang="ts" setup>
import { Image } from "@lucide/vue";
import Heading2 from "./Heading-2.vue";
</script>

<template>
  <nav class="border-b border-gray-200 flex items-center gap-4 px-4 py-2">
    <Image />
    <Heading2>IMAGETOOL</Heading2>
    <div className="w-10"></div>
    <RouterLink to="/">Images</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>
</template>
