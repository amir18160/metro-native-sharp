export interface IUploadProgress {
    fileName: string;
    progress: number;
    total: number;
}

export interface ITask {
    id: string;
    title: string;
    torrentTitle: string;
    state: string;
    errorMessage: string;
    torrentHash: string;
    imdbId: string;
    taskType: string;
    priority: string;
    seasonNumber?: number;
    episodeNumber?: number;
    createdAt?: string;
    updatedAt?: string;
    startTime?: string;
    endTime?: string;
    userId: string;
    userName: string;
    downloadProgress: number;
    downloadSize: number;
    downloadSpeed: number;
    uploadProgress: IUploadProgress[];
}

export type TorrentTaskState = 'Downloading' | 'Seeding' | 'Paused' | 'Error' | 'Completed';

export enum TorrentTaskType {
    Movie = 0,
    SingleEpisode = 1,
    RangedEpisodes = 2,
    FullSeason = 3,
    AllSeasons = 4,
    RangedSeasons = 5,
}

export enum TorrentTaskPriority {
    Low = 0,
    Medium = 1,
    High = 2,
}
