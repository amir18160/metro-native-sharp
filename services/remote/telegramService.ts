import { AxiosResponse } from 'axios';
import apiClient from '~/api/apiClient';
import { ApiResult } from '~/types/common/ApiResult';
import { IMovieSeriesNotificationType } from '~/types/server/telegram/movie-series-notification';

export interface IMovieSeriesNotificationParams {
    imdbId: string;
    notificationType: IMovieSeriesNotificationType;
    updateDetails?: {
        season?: number;
        episode?: number;
        isFullSeason?: boolean;
    };
}

export const sendMovieSeriesNotificationToChannel = async (
    data: IMovieSeriesNotificationParams
) => {
    const url = 'Telegram/send-movie-series-notification';
    const result: AxiosResponse<ApiResult> = await apiClient.post(url, {
        notificationParams: data,
    });
    return result.data;
};
