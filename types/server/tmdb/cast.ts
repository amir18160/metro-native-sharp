import { PersonGender } from './person-gender';

export interface Cast {
    castId: number;
    character: string;
    creditId: string;
    id: number;
    name: string;
    order: number;
    profilePath: string;
    gender: PersonGender;
    adult: boolean;
    knownForDepartment: string;
    originalName: string;
    popularity: number;
}
