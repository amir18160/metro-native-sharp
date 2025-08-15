import { CrewBase } from './crew-base';
import { CrewJob } from './crew-job';

export interface CrewAggregate extends CrewBase {
    jobs: CrewJob[];
    totalEpisodeCount: number;
}
