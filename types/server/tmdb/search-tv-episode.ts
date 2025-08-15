import { SearchBase } from './search-base';

export interface SearchTvEpisode extends SearchBase {
    airDate: Date;
    episodeNumber: number;
    name: string;
    overview: string;
    productionCode: string;
    seasonNumber: number;
    showId: number;
    stillPath: string;
    voteAverage: number;
    voteCount: number;
}
