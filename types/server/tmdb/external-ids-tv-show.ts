import { ExternalIds } from './external-ids';

export interface ExternalIdsTvShow extends ExternalIds {
    imdbId: string;
    tvdbId: string;
    facebookId: string;
    twitterId: string;
    instagramId: string;
}
