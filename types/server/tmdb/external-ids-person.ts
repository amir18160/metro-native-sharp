import { ExternalIds } from './external-ids';

export interface ExternalIdsPerson extends ExternalIds {
    facebookId: string;
    imdbId: string;
    twitterId: string;
    instagramId: string;
}
