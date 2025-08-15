import { AxiosResponse } from 'axios';
import apiClient from '~/api/apiClient';
import { ApiResult } from '~/types/common/ApiResult';
import { DateFilter } from '~/types/common/dateFilter';
import { PagedList } from '~/types/common/PagedList';
import { PagingParams } from '~/types/common/pagingParams';
import {
    ITask,
    TorrentTaskPriority,
    TorrentTaskState,
    TorrentTaskType,
} from '~/types/server/tasks/ITask';

// =================================================================
//                         Query Tasks
// =================================================================

export interface ITaskFilters extends PagingParams {
    title?: string;
    imdbId?: string;
    torrentHash?: string;
    state?: TorrentTaskState;
    taskType?: TorrentTaskType;
    priority?: TorrentTaskPriority;
    hasError?: boolean;
    userId?: string;
    createdAt?: DateFilter;
    updatedAt?: DateFilter;
}

export const queryTasks = async (query: ITaskFilters) => {
    const apiUrl = 'tasks/query-tasks';

    const response: AxiosResponse<ApiResult<PagedList<ITask>>> = await apiClient.get(apiUrl, {
        params: query,
    });

    return response.data;
};

// =================================================================
//                         Get Single Task
// =================================================================

export const getSingleTask = async (id: string) => {
    const apiUrl = `/tasks/${id}`;

    const response: AxiosResponse<ApiResult<ITask>> = await apiClient.get(apiUrl);

    return response.data;
};

// =================================================================
//                         Add Task
// =================================================================

interface IAddTask {
    title: string;
    magnet: string;
    taskType: TorrentTaskType;
    priority: TorrentTaskPriority;
    subtitleStoredPath?: string;
    imdbId: string;
    seasonNumber?: number;
    episodeNumber?: number;
}

export const addTorrentTask = async (data: IAddTask) => {
    const apiUrl = `/tasks/add-torrent-task`;

    const response: AxiosResponse<ApiResult> = await apiClient.post(apiUrl, data);

    return response.data;
};

// =================================================================
//                         Cancel Task
// =================================================================

export const CancelTorrentTask = async (id: string) => {
    const apiUrl = `tasks/cancel-task/${id}`;

    const response: AxiosResponse<ApiResult> = await apiClient.delete(apiUrl);

    return response.data;
};

// =================================================================
//                         Retry Task
// =================================================================

export const retryTorrentTask = async (id: string) => {
    const apiUrl = `tasks/retry-task/${id}`;

    const response: AxiosResponse<ApiResult> = await apiClient.patch(apiUrl);

    return response.data;
};
