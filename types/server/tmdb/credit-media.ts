import { CreditEpisode } from './credit-episode';
import { CreditSeason } from './credit-season';

export interface CreditMedia {
    character: string;
    episodes: CreditEpisode[];
    id: number;
    name: string;
    originalName: string;
    seasons: CreditSeason[];
}
