import { AxiosResponse } from 'axios';
import apiClient from '~/api/apiClient';
import { ApiResult } from '~/types/common/ApiResult';
import { IIndexer } from '~/types/server/indexers/IIndexer';
import { IIndexerSearchResult } from '~/types/server/indexers/IIndexerSearchResult';

// =================================================================
//                         List of providers
// =================================================================

export const getIndexerProvidersList = async () => {
    const apiUrl = `/indexer/get-indexers-list`;

    const response: AxiosResponse<ApiResult<IIndexer[]>> = await apiClient.get(apiUrl);

    return response.data;
};

// =================================================================
//                         Search indexer
// =================================================================

export interface ISearchIndexer {
    searchQuery: string;
    type?: string;
    categoryIds?: number[];
    indexerIds?: number[];
    Offset?: number;
    limit?: number;
}

export const searchIndexer = async (data: ISearchIndexer) => {
    const apiUrl = `/indexer/search`;

    const response: AxiosResponse<ApiResult<IIndexerSearchResult[]>> = await apiClient.post(
        apiUrl,
        data
    );

    return response.data;
};
