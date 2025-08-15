import { CastBase } from './cast-base';
import { CastRole } from './cast-role';

export interface CastAggregate extends CastBase {
    roles: CastRole[];
    totalEpisodeCount: number;
}
