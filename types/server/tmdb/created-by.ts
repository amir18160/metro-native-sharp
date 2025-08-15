import { PersonGender } from './person-gender';

export interface CreatedBy {
    id: number;
    creditId: string;
    name: string;
    gender: PersonGender;
    profilePath: string;
}
