import { SearchBase } from './search-base';

export interface SearchTvSeason extends SearchBase {
    airDate: Date;
    episodeCount: number;
    name: string;
    overview: string;
    posterPath: string;
    seasonNumber: number;
}
