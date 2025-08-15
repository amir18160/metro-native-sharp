import { CrewBase } from './crew-base';

export interface Crew extends CrewBase {
    creditId: string;
    job: string;
}
