import { TvGroupEpisode } from './tv-group-episode';

export interface TvGroup {
    id: string;
    name: string;
    order: number;
    episodes: TvGroupEpisode[];
    locked: boolean;
}
