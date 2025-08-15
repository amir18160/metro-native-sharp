import { Cast } from './cast';
import { Crew } from './crew';

export interface Credits {
    cast: Cast[];
    crew: Crew[];
    id: number;
}
