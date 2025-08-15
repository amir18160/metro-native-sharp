import { create } from 'zustand';
import { TorrentTaskPriority, TorrentTaskType } from '~/types/server/tasks/ITask';
import { TMDbMedia } from '~/types/server/tmdb/tm-db-media';

interface TaskData {
    imdbId: string | null;
    magnet: string | null;
    taskType: TorrentTaskType;
    priority: TorrentTaskPriority;
    media: TMDbMedia | null;
    subtitleStoredPath: string | null;
    seasonNumber: number | null;
    episodeNumber: number | null;
}

export interface TaskStoreState extends TaskData {
    setImdbId: (imdbId: string) => void;
    setMagnet: (magnet: string) => void;
    setTaskType: (taskType: TorrentTaskType) => void;
    setPriority: (priority: TorrentTaskPriority) => void;
    setMedia: (media: TMDbMedia) => void;
    setSubtitleStoredPath: (url: string | null) => void;
    setSeasonNumber: (seasonNumber: number) => void;
    setEpisodeNumber: (episodeNumber: number) => void;
    reset: () => void;
}

const initialState: TaskData = {
    imdbId: null,
    magnet: null,
    taskType: TorrentTaskType.Movie,
    priority: TorrentTaskPriority.Medium,
    media: null,
    subtitleStoredPath: null,
    seasonNumber: null,
    episodeNumber: null,
};

export const useAddTaskStore = create<TaskStoreState>((set) => ({
    ...initialState,
    setImdbId: (imdbId) => set({ imdbId }),
    setMagnet: (magnet) => set({ magnet }),
    setTaskType: (taskType) => set({ taskType }),
    setPriority: (priority) => set({ priority }),
    setSubtitleStoredPath: (subtitleStoredPath) => set({ subtitleStoredPath }),
    setSeasonNumber: (seasonNumber) => set({ seasonNumber }),
    setEpisodeNumber: (episodeNumber) => set({ episodeNumber }),
    setMedia: (media) => set({ media }),
    reset: () => set(initialState),
}));
