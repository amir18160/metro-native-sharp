import { TorrentSearchSource } from '~/types/local/torrentSearchSource';
import { TorrentSource } from '~/types/server/scrapers/TorrentSource';
import { TorrentTaskPriority, TorrentTaskType } from '~/types/server/tasks/ITask';

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
