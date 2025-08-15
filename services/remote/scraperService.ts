import { AxiosResponse } from 'axios';
import apiClient from '~/api/apiClient';
import { ApiResult } from '~/types/common/ApiResult';
import { AbstractedLatestTorrent } from '~/types/server/scrapers/AbstractedLatestTorrent';
import { RarbgDetails } from '~/types/server/scrapers/rarbg-details';
import { RarbgPreview } from '~/types/server/scrapers/rarbg-preview';
import { X1337Details } from '~/types/server/scrapers/x1337-details';
import { X1337Preview } from '~/types/server/scrapers/x1337-preview';
import { YtsDetails } from '~/types/server/scrapers/yts-details';
import { YtsPreview } from '~/types/server/scrapers/yts-preview';

// =================================================================
//                         Common
// =================================================================

export interface ISearchScraperParams {
    searchTerm: string;
}

// =================================================================
//                         Latest Movies
// =================================================================

export const getLatestMovies = async () => {
    const url = 'scrapers/get-latest-movies';
    const result: AxiosResponse<ApiResult<AbstractedLatestTorrent[]>> = await apiClient.get(url);
    return result.data;
};

// =================================================================
//                         All YTS Movies
// =================================================================

export interface IYtsSearchParams {
    Genre: string;
    SortBy: string;
    Page: number;
}

export const getAllYtsMovies = async (data: IYtsSearchParams) => {
    const url = 'scrapers/get-all-yts-movies';
    const result: AxiosResponse<ApiResult<YtsPreview[]>> = await apiClient.get(url, {
        params: data,
    });
    return result.data;
};

// =================================================================
//                         Get Torrent Details
// =================================================================

export interface IGetTorrentDetailsParams {
    source: string;
}

export const getTorrentDetails = async (data: IGetTorrentDetailsParams) => {
    const url = 'scrapers/get-torrent-details';
    const result: AxiosResponse<ApiResult<YtsDetails | RarbgDetails | X1337Details>> =
        await apiClient.post(url, data);
    return result.data;
};

// =================================================================
//                         Search
// =================================================================

export const searchYts = async (data: ISearchScraperParams) => {
    const url = 'scrapers/search-yts';
    const result: AxiosResponse<ApiResult<YtsPreview[]>> = await apiClient.get(url, {
        params: data,
    });
    return result.data;
};

export const searchRARBG = async (data: ISearchScraperParams) => {
    const url = 'scrapers/search-rarbg';
    const result: AxiosResponse<ApiResult<RarbgPreview[]>> = await apiClient.get(url, {
        params: data,
    });
    return result.data;
};

export const search1337x = async (data: ISearchScraperParams) => {
    const url = 'scrapers/search-1337x';
    const result: AxiosResponse<ApiResult<X1337Preview[]>> = await apiClient.get(url, {
        params: data,
    });
    return result.data;
};
