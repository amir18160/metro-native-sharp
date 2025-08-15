import { SearchBase } from './search-base';

export interface SearchMovieTvBase extends SearchBase {
    backdropPath: string;
    genreIds: number[];
    originalLanguage: string;
    overview: string;
    posterPath: string;
    voteAverage: number;
    voteCount: number;
}
