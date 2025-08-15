import { KnownForBase } from './known-for-base';

export interface KnownForMovie extends KnownForBase {
    adult: boolean;
    originalTitle: string;
    releaseDate: Date;
    title: string;
    vide: boolean;
}
