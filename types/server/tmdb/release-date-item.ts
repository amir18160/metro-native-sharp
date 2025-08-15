import { ReleaseDateType } from './release-date-type';

export interface ReleaseDateItem {
    certification: string;
    iso_639_1: string;
    note: string;
    releaseDate: Date;
    type: ReleaseDateType;
}
