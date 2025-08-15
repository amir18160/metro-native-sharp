import { ExternalIds } from './external-ids';

export interface ExternalIdsMovie extends ExternalIds {
    imdbId: string;
    facebookId: string;
    twitterId: string;
    instagramId: string;
}
