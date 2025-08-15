import { TorrentSource } from './TorrentSource';

export interface AbstractedLatestTorrent {
    title: string;
    detailUrl: string;
    category: string;
    categoryUrl: string;
    year: string;
    size: string;
    seeders: number;
    leechers: number;
    magnetLink: string;
    imageUrl: string;
    rating: string;
    genres: string[];
    type: TorrentSource;
}
