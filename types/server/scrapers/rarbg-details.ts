import { RarbgPeerInfo } from './rarbg-peer-info';
import { RarbgImdbInfo } from './rarbg-imdb-info';

export interface RarbgDetails {
    torrent: string;
    magnetLink: string;
    thumbnail: string;
    trailer: string;
    uploader: string;
    downloads: string;
    type: string;
    genre: string[];
    infoHash: string;
    language: string;
    description: string;
    category: string;
    size: string;
    added: string;
    peers: RarbgPeerInfo;
    multipleQualityAvailable: boolean;
    imdb: RarbgImdbInfo;
}
