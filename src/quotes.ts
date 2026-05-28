
// quotes from dummyjson.com/quotes

export type Quote = {
    id: number,
    quote: string,
    author: string
}

export type QuotesResponse = {
    quotes: Quote[],
    limit: number,
    skip: number, // eg offset
    total: number
}

