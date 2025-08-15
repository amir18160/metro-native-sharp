import { TvEpisodeInfo } from './tv-episode-info';

export interface TvEpisodeBase extends TvEpisodeInfo {
    airDate: Date;
    name: string;
    overview: string;
    productionCode: string;
    showId: number;
    stillPath: string;
    voteAverage: number;
    voteCount: number;
    runtime: number;
    episodeType: string;
}
