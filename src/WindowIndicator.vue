<script setup lang="ts">
import { useWindowSize } from './composables/useWindowSize';


const size = useWindowSize();

</script>
<template>
    <div class="py-8 flex flex-col justity-center items-center bg-zinc-200 shadow-3xl">
        {{ size.width }} x {{ size.height }}
    </div>
</template> 