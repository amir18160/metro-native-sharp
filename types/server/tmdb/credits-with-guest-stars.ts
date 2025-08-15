import { Credits } from './credits';
import { Cast } from './cast';

export interface CreditsWithGuestStars extends Credits {
    guestStars: Cast[];
}
