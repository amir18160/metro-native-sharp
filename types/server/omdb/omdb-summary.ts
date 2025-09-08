import { OmdbItemType } from './omdb-item-type';

export interface IOmdbSummary {
    id: string;
    imdbId: string;
    title: string;
    poster: string;
    imdbRating?: number;
    imdbVotes?: number;
    type: OmdbItemType;
    year?: number;
}
