import { Images } from './images';
import { TranslationsContainer } from './translations-container';
import { SearchMovie } from './search-movie';

export interface Collection {
    backdropPath: string;
    id: number;
    images: Images;
    translations: TranslationsContainer;
    name: string;
    overview: string;
    parts: SearchMovie[];
    posterPath: string;
}
