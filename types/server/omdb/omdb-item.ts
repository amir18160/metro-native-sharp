import { Tag } from '../tags/tag';
import { OmdbItemType } from './omdb-item-type';

export interface OmdbItem {
    id: string;
    imdbId: string;
    title: string;
    rated: string;
    released: string;
    runtime: string;
    genres: string[];
    actors: string[];
    plot: string;
    plotFa: string;
    languages: string[];
    countries: string[];
    awards: string;
    poster: string;
    metascore?: number;
    rottenTomatoesScore?: number;
    imdbRating?: number;
    imdbVotes?: number;
    type: OmdbItemType;
    boxOffice?: string;
    totalSeasons?: number;
    directors: string[];
    writers: string[];
    year?: number;

    seasons?: unknown[];
    documents?: unknown[];
    tags?: Tag[];
}
