<script setup lang="ts">
import CardPanel from '../CardPanel.vue';
import { useQuotesQuery } from '../../composables/useQuotesQuery.ts';
import { ref } from 'vue';

const skip = ref(0)
const { data: quotes, isLoading } = useQuotesQuery(skip);

</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="flex gap-4">
            <button @click="skip -= 30">Prev 30</button>
            <button @click="skip += 30">Next 30</button>
        </div>
        <div class="flex flex-wrap gap-4">
        <template v-if="isLoading">
            Loading quotes...
        </template>
        <template v-else-if="quotes?.length === 0">
            No quotes found
        </template>
        <template v-else>
            <CardPanel v-for="quote in quotes" :key="quote.id"
                :heading="'Quote ' + quote.id"
                :footer="quote.author">
                {{ quote.quote }}
            </CardPanel>
        </template>
        </div>
    </div>
</template>