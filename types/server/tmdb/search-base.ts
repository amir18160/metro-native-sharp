import { MediaType } from './media-type';

export interface SearchBase {
    id: number;
    mediaType: MediaType;
    popularity: number;
}
