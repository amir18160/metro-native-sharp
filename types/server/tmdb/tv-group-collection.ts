import { TvGroupType } from './tv-group-type';
import { NetworkWithLogo } from './network-with-logo';
import { TvGroup } from './tv-group';

export interface TvGroupCollection {
    id: string;
    name: string;
    type: TvGroupType;
    description: string;
    network: NetworkWithLogo;
    episodeCount: number;
    groupCount: number;
    groups: TvGroup[];
}
