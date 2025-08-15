import { SearchPerson } from './search-person';
import { PersonGender } from './person-gender';

export interface FindPerson extends SearchPerson {
    gender: PersonGender;
    knownForDepartment: string;
}
