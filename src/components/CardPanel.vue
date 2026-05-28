<script setup lang="ts">
interface PropsType {  // definiere unsere eigenschaften
    heading: string
    footer?: string
    collapsed?: boolean
}
const { heading, footer = "Default footer text" } = defineProps<PropsType>()
</script>
<template>
    <div class="flex flex-col gap-4 border border-gray-300 shadow-xl p-4 m-2 rounded-xl">
        <div class="font-semibold text-xl uppercase tracking-widest">{{ heading }}</div>
        <template v-if="!collapsed">
            <slot ></slot>
            <div class="text-right pt-2 text-xs text-gray-500 border-gray-300 border-t">
                {{ footer }}
            </div>
        </template>
    </div>
</template>
