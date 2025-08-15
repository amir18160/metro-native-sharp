export interface IIndexerSearchResult {
    id: number;
    guid: string;
    age: number | null;
    ageHours: number | null;
    ageMinutes: number | null;
    size: number | null;
    files: number | null;
    grabs: number | null;
    indexerId: number | null;
    indexer: string;
    subGroup: string;
    releaseHash: string;
    title: string;
    sortTitle: string;
    imdbId: number | null;
    tmdbId: number | null;
    tvdbId: number | null;
    tvMazeId: number | null;
    publishDate: string | null;
    commentUrl: string;
    downloadUrl: string;
    infoUrl: string;
    posterUrl: string;
    indexerFlags: string[];
    categories: IIndexerSearchCategory[];
    magnetUrl: string;
    infoHash: string;
    seeders: number | null;
    leechers: number | null;
    protocol: string;
    downloadClientId: number | null;
}

export interface IIndexerSearchCategory {
    id: number;
    name: string;
    description: string;
}
