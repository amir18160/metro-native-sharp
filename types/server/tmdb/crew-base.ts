import { PersonGender } from './person-gender';

export interface CrewBase {
    department: string;
    id: number;
    name: string;
    profilePath: string;
    gender: PersonGender;
    adult: boolean;
    knownForDepartment: string;
    originalName: string;
    popularity: number;
}
