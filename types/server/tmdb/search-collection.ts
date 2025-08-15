import { SearchBase } from './search-base';

export interface SearchCollection extends SearchBase {
    name: string;
    originalName: string;
    adult: boolean;
    backdropPath: string;
    originalLanguage: string;
    overview: string;
    posterPath: string;
}
