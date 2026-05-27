<script setup lang="ts">
defineOptions({
  name: "CounterOne",
});

const props = defineProps<{
  count: number;
}>();

const emit = defineEmits<{
  (e: "update:count", value: number): void;
}>();

const increment = () => {
  emit("update:count", props.count + 1);
};
</script>

<template>
  <div>
    <p>Count: {{ props.count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
