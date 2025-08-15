import { ReleaseDateItem } from './release-date-item';

export interface ReleaseDatesContainer {
    iso_3166_1: string;
    releaseDates: ReleaseDateItem[];
}
