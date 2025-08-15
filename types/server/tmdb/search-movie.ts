import { SearchMovieTvBase } from './search-movie-tv-base';

export interface SearchMovie extends SearchMovieTvBase {
    adult: boolean;
    originalTitle: string;
    releaseDate: Date;
    title: string;
    video: boolean;
}
