import { KnownForBase } from './known-for-base';

export interface KnownForTv extends KnownForBase {
    firstAirDate: Date;
    name: string;
    originalName: string;
    originCountry: string[];
}
