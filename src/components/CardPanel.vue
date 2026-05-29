<script setup lang="ts">
import { XCircle } from "@lucide/vue";
import FooterLine from "./FooterLine.vue";
import HBox from "./HBox.vue";
import HeadingLine from "./HeadingLine.vue";
import ShadowBox from "./ShadowBox.vue";
import SpaceEater from "./SpaceEater.vue";

interface PropsType {
  // definiere unsere eigenschaften
  heading: string;
  footer?: string;
  collapsed?: boolean;
  showToggle?: boolean;
}
const {
  heading,
  footer = "Default footer text",
  showToggle = true,
} = defineProps<PropsType>();
const emit = defineEmits(["toggle"]);

const handleToggle = () => {
  emit("toggle");
};
</script>
<template>
  <ShadowBox>
    <HBox>
      <HeadingLine>{{ heading }}</HeadingLine>
      <button v-if="showToggle" @click="handleToggle()">
        <XCircle />
      </button>
    </HBox>
    <template v-if="!collapsed || !showToggle">
      <slot></slot>
      <SpaceEater></SpaceEater>
      <FooterLine>{{ footer }}</FooterLine>
    </template>
  </ShadowBox>
</template>
