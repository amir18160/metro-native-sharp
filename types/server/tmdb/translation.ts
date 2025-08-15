import { TranslationData } from './translation-data';

export interface Translation {
    englishName: string;
    iso_639_1: string;
    iso_3166_1: string;
    name: string;
    data: TranslationData;
}
