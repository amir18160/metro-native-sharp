import { YtsTorrent } from './yts-torrent';

export interface YtsDetails {
    title: string;
    year: string;
    detailUrl: string;
    imageUrl: string;
    description: string;
    imdbId: string;
    imdbUrl: string;
    imdbRating: string;
    genres: string[];
    availableTorrents: YtsTorrent[];
}
