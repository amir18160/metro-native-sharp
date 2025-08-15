import { MediaType } from './media-type';

export interface KnownForBase {
    backdropPath: string;
    genreIds: number[];
    id: number;
    mediaType: MediaType;
    originalLanguage: string;
    overview: string;
    popularity: number;
    posterPath: string;
    voteAverage: number;
    voteCount: number;
}
