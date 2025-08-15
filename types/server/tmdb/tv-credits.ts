import { TvRole } from './tv-role';
import { TvJob } from './tv-job';

export interface TvCredits {
    cast: TvRole[];
    crew: TvJob[];
    id: number;
}
