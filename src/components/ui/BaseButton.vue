<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import { computed, useAttrs } from "vue";

export type ButtonVariant = "primary" | "ghost";

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant;
  }>(),
  {
    variant: "primary",
  },
);

// Opt out of automatic fallthrough so we can merge `class` ourselves in a
// Tailwind-aware way (conflicting utilities are deduped, the passed class wins).
defineOptions({ inheritAttrs: false });

const attrs = useAttrs();

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-slate-900 text-white hover:bg-slate-700",
  ghost: "text-slate-600 hover:bg-slate-100",
};

const classes = computed(() =>
  twMerge(
    "rounded-lg px-4 py-1.5 text-sm font-medium",
    variantClasses[props.variant],
    attrs.class as string,
  ),
);

// Forward everything except `class`, which we handle above. `type` stays in
// here: when the parent passes one it overrides the default below (v-bind is
// applied after the static `type`); otherwise the default "button" wins.
const forwardedAttrs = computed(() => {
  const rest = { ...attrs };
  delete rest.class;
  return rest;
});
</script>

<template>
  <button type="button" :class="classes" v-bind="forwardedAttrs">
    <slot />
  </button>
</template>
