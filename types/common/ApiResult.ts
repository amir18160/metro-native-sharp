export interface ApiResult<T = null> {
    status: 'success' | 'error';
    data: T | null;
    messages: null | string[];
}
