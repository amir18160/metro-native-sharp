import { TvEpisodeAccountState } from './tv-episode-account-state';

export interface TvEpisodeAccountStateWithNumber extends TvEpisodeAccountState {
    episodeNumber: number;
}
