import { Tag } from './tag';

export interface TagsFeedDto {
    pinned: Tag[];
    recommended: Tag[];
    new: Tag[];
    newTopRated: Tag[];
    updatedSeries: Tag[];
    updatedMovies: Tag[];
}
