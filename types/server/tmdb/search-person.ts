import { SearchBase } from './search-base';
import { KnownForBase } from './known-for-base';

export interface SearchPerson extends SearchBase {
    adult: boolean;
    knownFor: KnownForBase[];
    name: string;
    profilePath: string;
}
