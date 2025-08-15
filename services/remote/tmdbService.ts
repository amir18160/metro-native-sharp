import { AxiosResponse } from 'axios';
import apiClient from '~/api/apiClient';
import { ApiResult } from '~/types/common/ApiResult';
import { Movie } from '~/types/server/tmdb/movie';
import { TMDbMedia } from '~/types/server/tmdb/tm-db-media';
import { TvShow } from '~/types/server/tmdb/tv-show';

// =================================================================
//                         common
// =================================================================

export interface IGetDetailsParams {
    id: number;
    IncludeExternalIds?: boolean;
    IncludeImages?: boolean;
    IncludeCredits?: boolean;
    IncludeSimilar?: boolean;
}

// =================================================================
//                         Search Multi
// =================================================================

export interface ISearchTMDbMedia {
    searchQuery: string;
}

export const searchMulti = async (data: ISearchTMDbMedia) => {
    const url = 'tmdb/search-multi';
    const result: AxiosResponse<ApiResult<TMDbMedia[]>> = await apiClient.get(url, {
        params: data,
    });

    return result.data;
};

// =================================================================
//                         Get Movie Details
// =================================================================

export const getMovieDetails = async (data: IGetDetailsParams) => {
    const url = 'tmdb/get-movie-details';
    const result: AxiosResponse<ApiResult<Movie>> = await apiClient.get(url, { params: data });

    return result.data;
};

// =================================================================
//                         Get TV Details
// =================================================================

export interface IGetTvDetailsParams extends IGetDetailsParams {
    IncludeEpisodeGroups?: boolean;
}

export const getTvShowDetails = async (data: IGetTvDetailsParams) => {
    const url = 'tmdb/get-tv-show-details';
    const result: AxiosResponse<ApiResult<TvShow>> = await apiClient.get(url, { params: data });

    return result.data;
};
