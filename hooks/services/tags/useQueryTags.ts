import { useQuery } from '@tanstack/react-query';
import { IQueryTagsParams, queryTags } from '~/services/remote/tagService';

export const useQueryTags = (data: IQueryTagsParams, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['query-tags', data],
        enabled: enabled,
        queryFn: () => queryTags(data),
    });
};
