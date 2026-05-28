import { useQuery } from "@tanstack/vue-query";
import type { QuotesResponse } from "../quotes";
import type { Ref } from "vue";

// preferred way of data-fetching

export function useQuotesQuery(skip: Ref<number>) {
    return useQuery({
        queryKey: [ "quotes", skip],
        queryFn: async () => {
            const resp = await fetch("https://dummyjson.com/quotes?skip=" + skip.value)
            const data = await resp.json() as QuotesResponse
            return data.quotes
        },
        staleTime: 60 * 60 * 1_000,
    })
}