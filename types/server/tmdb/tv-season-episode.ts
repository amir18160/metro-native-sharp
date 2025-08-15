import { Crew } from './crew';
import { Cast } from './cast';

export interface TvSeasonEpisode {
    airDate: Date;
    crew: Crew[];
    episodeNumber: number;
    episodeType: string;
    guestStars: Cast[];
    id: number;
    name: string;
    overview: string;
    productionCode: string;
    runtime: number;
    seasonNumber: number;
    stillPath: string;
    voteAverage: number;
    voteCount: number;
}
