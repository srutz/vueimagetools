<template>
  <input
    type="checkbox"
    :checked="checked"
    class="checkbox"
    @change="handleChange"
  />
</template>
<script lang="ts" setup>
const { checked } = defineProps<{
  checked?: boolean;
}>();
const emit = defineEmits(["checked"]);
const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("checked", target.checked);
};
</script>
