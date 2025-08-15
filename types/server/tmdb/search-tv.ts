import { SearchMovieTvBase } from './search-movie-tv-base';

export interface SearchTv extends SearchMovieTvBase {
    firstAirDate: Date;
    name: string;
    originalName: string;
    originCountry: string[];
}
