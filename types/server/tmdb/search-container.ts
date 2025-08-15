export interface SearchContainer<T> {
    page: number;
    results: T[];
    totalPages: number;
    totalResults: number;
}
