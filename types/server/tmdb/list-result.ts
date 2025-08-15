import { MediaType } from './media-type';

export interface ListResult {
    description: string;
    favoriteCount: number;
    id: string;
    iso_639_1: string;
    itemCount: number;
    listType: MediaType;
    name: string;
    posterPath: string;
}
