
// quotes from dummyjson.com/quotes

// ZOD oder Yup für datenvalidierung

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

