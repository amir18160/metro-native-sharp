import { AuthorDetails } from './author-details';

export interface ReviewBase {
    author: string;
    authorDetails: AuthorDetails;
    content: string;
    id: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
}
