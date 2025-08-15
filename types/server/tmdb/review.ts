import { ReviewBase } from './review-base';
import { MediaType } from './media-type';

export interface Review extends ReviewBase {
    iso_639_1: string;
    mediaId: number;
    mediaTitle: string;
    mediaType: MediaType;
}
