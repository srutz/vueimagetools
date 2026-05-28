import { onMounted, onUnmounted, ref } from "vue";
import type { Quote, QuotesResponse } from "../quotes";

function delay(ms: number) {
    return new Promise((r) => setTimeout(r, ms))
}

export function useQuotes(skip?: number) {
    skip ??= 0;
    const quotes = ref<Quote[]>([])
    const isLoading = ref(false)

    onMounted(async () => {
        console.log("onMounted")
        isLoading.value = true
        try {
            const resp = await fetch("https://dummyjson.com/quotes?skip=" + skip)
            const data = await resp.json() as QuotesResponse
            //await delay(2_000)
            quotes.value = data.quotes
        } finally {
            isLoading.value = false
        }
    })

    onUnmounted(() => {
        console.log("onUnmounted")
    })
    return { 
        quotes: quotes,
        isLoading: isLoading 
    }
}