import { SearchContainer } from './search-container';

export interface SearchContainerWithId<T> extends SearchContainer<T> {
    id: number;
}
