import { AxiosResponse } from 'axios';
import apiClient from '~/api/apiClient';
import { ApiResult } from '~/types/common/ApiResult';
import { PagedList } from '~/types/common/PagedList';
import { PagingParams } from '~/types/common/pagingParams';
import { OmdbItem } from '~/types/server/omdb/omdb-item';

// =================================================================
//                         Query OMDb
// =================================================================

export interface IQueryOMDbParams extends PagingParams {
    imdbId?: string;
    title?: string;
    includeTags?: boolean;
    includeDocuments?: boolean;
    includeSeasons?: boolean;
}

export const queryOMDb = async (data: IQueryOMDbParams) => {
    const url = 'omdb/query-omdb';
    const result: AxiosResponse<ApiResult<PagedList<OmdbItem>>> = await apiClient.get(url, {
        params: data,
    });

    return result.data;
};
