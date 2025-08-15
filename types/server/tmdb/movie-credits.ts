import { MovieRole } from './movie-role';
import { MovieJob } from './movie-job';

export interface MovieCredits {
    cast: MovieRole[];
    crew: MovieJob[];
    id: number;
}
