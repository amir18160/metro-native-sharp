import { SearchBase } from './search-base';
import { MediaType } from './media-type';

export interface TaggedImage {
    aspectRatio: number;
    filePath: string;
    height: number;
    id: string;
    imageType: string;
    iso_639_1: string;
    media: SearchBase;
    mediaType: MediaType;
    voteAverage: number;
    voteCount: number;
    width: number;
}
