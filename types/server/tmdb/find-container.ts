import { SearchMovie } from './search-movie';
import { FindPerson } from './find-person';
import { SearchTvEpisode } from './search-tv-episode';
import { SearchTv } from './search-tv';
import { FindTvSeason } from './find-tv-season';

export interface FindContainer {
    movieResults: SearchMovie[];
    personResults: FindPerson[];
    tvEpisode: SearchTvEpisode[];
    tvResults: SearchTv[];
    tvSeason: FindTvSeason[];
}
