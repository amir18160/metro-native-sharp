import { CreditType } from './credit-type';
import { CreditMedia } from './credit-media';
import { MediaType } from './media-type';
import { CreditPerson } from './credit-person';

export interface Credit {
    creditType: CreditType;
    department: string;
    id: string;
    job: string;
    media: CreditMedia;
    mediaType: MediaType;
    person: CreditPerson;
}
