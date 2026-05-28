<script setup lang="ts">
import { XCircle } from '@lucide/vue';

interface PropsType {  // definiere unsere eigenschaften
    heading: string
    footer?: string
    collapsed?: boolean
}
const { heading, footer = "Default footer text" } = defineProps<PropsType>()
const emit = defineEmits([ "toggle"])

const handleToggle = () => {
    emit("toggle")
}

</script>
<template>
    <div class="flex flex-col gap-4 border border-gray-300 shadow-xl p-4 m-2 rounded-xl">
        <div class="flex justify-between items-center">
            <div class="font-semibold text-xl uppercase tracking-widest">{{ heading }}</div>
            <button @click="handleToggle()">
                <XCircle/>
            </button>
        </div>
        <template v-if="!collapsed">
            <slot ></slot>
            <div class="text-right pt-2 text-xs text-gray-500 border-gray-300 border-t">
                {{ footer }}
            </div>
        </template>
    </div>
</template>
