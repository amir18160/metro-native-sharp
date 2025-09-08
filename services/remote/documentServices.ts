import { AxiosResponse } from 'axios';
import apiClient from '~/api/apiClient';
import { ApiResult } from '~/types/common/ApiResult';
import { PagedList } from '~/types/common/PagedList';
import { PagingParams } from '~/types/common/pagingParams';
import { IDocumentDto, IUpdatedDocument } from '~/types/server/documents/document-dto';

export type IGetTempDocumentsParams = PagingParams;

export const getTempDocuments = async (data: IGetTempDocumentsParams) => {
    const url = 'Documents/get-temp-documents';
    const response: AxiosResponse<ApiResult<PagedList<IDocumentDto>>> = await apiClient.get(url, {
        params: data,
    });
    return response.data;
};

export const updateTempDocument = async (data: IUpdatedDocument) => {
    const url = 'documents/update-temp-document';
    const response: AxiosResponse<ApiResult> = await apiClient.post(url, data);
    return response.data;
};
