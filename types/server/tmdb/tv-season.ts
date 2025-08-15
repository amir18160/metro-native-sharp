import { ResultContainer } from './result-container';
import { TvEpisodeAccountStateWithNumber } from './tv-episode-account-state-with-number';
import { Credits } from './credits';
import { TvSeasonEpisode } from './tv-season-episode';
import { ExternalIdsTvSeason } from './external-ids-tv-season';
import { PosterImages } from './poster-images';
import { Video } from './video';
import { TranslationsContainer } from './translations-container';

export interface TvSeason {
    accountStates: ResultContainer<TvEpisodeAccountStateWithNumber>;
    airDate: Date;
    credits: Credits;
    episodes: TvSeasonEpisode[];
    externalIds: ExternalIdsTvSeason;
    id: number;
    images: PosterImages;
    name: string;
    overview: string;
    posterPath: string;
    seasonNumber: number;
    voteAverage: number;
    videos: ResultContainer<Video>;
    translations: TranslationsContainer;
}
