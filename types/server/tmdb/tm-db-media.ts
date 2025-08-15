import { MediaType } from './media-type';

export interface TMDbMedia {
    id: number;
    adult: boolean;
    originalTitle: string;
    releaseDate: Date;
    title: string;
    mediaType: MediaType;
    video: boolean;
    backdrop: string;
    genreIds: number[];
    originalLanguage: string;
    overview: string;
    poster: string;
    voteAverage: number;
    voteCount: number;
    firstAirDate: Date;
    originCountry: string[];
}
