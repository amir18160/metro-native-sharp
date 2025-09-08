import { AxiosResponse } from 'axios';
import apiClient from '~/api/apiClient';
import { ApiResult } from '~/types/common/ApiResult';
import { TagsFeedDto } from '~/types/server/tags/tag-feed-dto';
import { TagType } from '~/types/server/tags/tag-type';

// =================================================================
//                         Create Tag
// =================================================================

export interface CreateTagParams {
    type: TagType;
    description: string;
    isPinned: boolean;
    omdbItemId: string;
}

export const createTag = async (data: CreateTagParams) => {
    const url = 'tags/create-tag';
    const result: AxiosResponse<ApiResult> = await apiClient.post(url, data);

    return result.data;
};

// =================================================================
//                         Delete Tag
// =================================================================
export const deleteTag = async (id: string) => {
    const url = `tags/delete-tag/${id}`;
    const result: AxiosResponse<ApiResult> = await apiClient.delete(url);

    return result.data;
};

// =================================================================
//                         Query Tag
// =================================================================

export interface IQueryTagsParams {
    IncludeOmdbItem?: boolean;
}

export const queryTags = async (data: IQueryTagsParams) => {
    const url = 'tags/query-tags';
    const result: AxiosResponse<ApiResult<TagsFeedDto>> = await apiClient.get(url, {
        params: data,
    });

    return result.data;
};
