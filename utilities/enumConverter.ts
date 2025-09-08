import { TorrentSearchSource } from '~/types/local/torrentSearchSource';
import { OmdbItemType } from '~/types/server/omdb/omdb-item-type';
import { TorrentSource } from '~/types/server/scrapers/TorrentSource';
import { TagType } from '~/types/server/tags/tag-type';
import { TorrentTaskPriority, TorrentTaskType } from '~/types/server/tasks/ITask';
import { IMovieSeriesNotificationType } from '~/types/server/telegram/movie-series-notification';

export function torrentTaskTypeToString(type: TorrentTaskType): string {
    return TorrentTaskType[type];
}

export function stringToTorrentTaskType(typeString: string): TorrentTaskType {
    const enumKeys = Object.keys(TorrentTaskType).filter((key) => isNaN(Number(key)));

    if (enumKeys.includes(typeString)) {
        return TorrentTaskType[typeString as keyof typeof TorrentTaskType];
    }

    throw new Error('Invalid task type');
}

export function torrentTaskPriorityToString(priority: TorrentTaskPriority): string {
    return TorrentTaskPriority[priority];
}

export function stringToTorrentTaskPriority(priorityString: string): TorrentTaskPriority {
    const enumKeys = Object.keys(TorrentTaskPriority).filter((key) => isNaN(Number(key)));

    if (enumKeys.includes(priorityString)) {
        return TorrentTaskPriority[priorityString as keyof typeof TorrentTaskPriority];
    }

    throw new Error('Invalid task priority');
}

export function torrentSearchSourceToString(source: TorrentSearchSource): string {
    return TorrentSearchSource[source];
}

export function stringToTorrentSearchSource(sourceString: string): TorrentSearchSource {
    const enumKeys = Object.keys(TorrentSearchSource).filter((key) => isNaN(Number(key)));

    if (enumKeys.includes(sourceString)) {
        return TorrentSearchSource[sourceString as keyof typeof TorrentSearchSource];
    }

    throw new Error('Invalid search source');
}

export function torrentSourceToString(source: TorrentSource): string {
    return TorrentSource[source];
}

export function stringToTorrentSource(sourceString: string): TorrentSource {
    const enumKeys = Object.keys(TorrentSource).filter((key) => isNaN(Number(key)));

    if (enumKeys.includes(sourceString)) {
        return TorrentSource[sourceString as keyof typeof TorrentSource];
    }

    throw new Error('Invalid search source');
}

export function stringToTagType(sourceString: string): TagType {
    const enumKeys = Object.keys(TagType).filter((key) => isNaN(Number(key)));

    if (enumKeys.includes(sourceString)) {
        return TagType[sourceString as keyof typeof TagType];
    }

    throw new Error('Invalid search source');
}

export function tagTypeToString(source: TagType): string {
    return TagType[source];
}

export function omdbItemTypeToString(source: OmdbItemType): string {
    return OmdbItemType[source];
}

export function stringToOmdbItemType(sourceString: string): OmdbItemType {
    const enumKeys = Object.keys(OmdbItemType).filter((key) => isNaN(Number(key)));

    if (enumKeys.includes(sourceString)) {
        return OmdbItemType[sourceString as keyof typeof OmdbItemType];
    }

    throw new Error('Invalid search source');
}

export function notificationTypeToString(source: IMovieSeriesNotificationType): string {
    return IMovieSeriesNotificationType[source];
}

export function stringToNotificationType(sourceString: string): IMovieSeriesNotificationType {
    const enumKeys = Object.keys(IMovieSeriesNotificationType).filter((key) => isNaN(Number(key)));

    if (enumKeys.includes(sourceString)) {
        return IMovieSeriesNotificationType[
            sourceString as keyof typeof IMovieSeriesNotificationType
        ];
    }

    throw new Error('Invalid search source');
}
