export type PaginationResponse<T> = {
    current_page: number,
    data: T[],
    first_page_url: string | null,
    next_page_url: string | null
    per_page: number
    prev_page_url: string | null
}