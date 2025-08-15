import { SearchMovie } from './search-movie';

export interface SearchMovieWithRating extends SearchMovie {
    rating: number;
}
