import { CastAggregate } from './cast-aggregate';
import { CrewAggregate } from './crew-aggregate';

export interface CreditsAggregate {
    cast: CastAggregate[];
    crew: CrewAggregate[];
    id: number;
}
