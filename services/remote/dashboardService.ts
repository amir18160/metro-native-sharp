import { AxiosResponse } from 'axios';
import apiClient from '~/api/apiClient';
import { ApiResult } from '~/types/common/ApiResult';
import { ISystemInfo } from '~/types/server/dashboard/resources';
import { IStats } from '~/types/server/dashboard/stats';

// =================================================================
//                         System Resource
// =================================================================

export const getSystemResources = async () => {
    const apiUrl = `/dashboard/system-info`;

    const response: AxiosResponse<ApiResult<ISystemInfo>> = await apiClient.get(apiUrl);

    return response.data;
};

export const getStats = async () => {
    const apiUrl = `/dashboard/stats`;

    const response: AxiosResponse<ApiResult<IStats>> = await apiClient.get(apiUrl);

    return response.data;
};
