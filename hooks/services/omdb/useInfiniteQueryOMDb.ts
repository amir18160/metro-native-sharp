import { useInfiniteQuery } from '@tanstack/react-query';
import { IQueryOMDbParams, queryOMDb } from '~/services/remote/omdbService';

export const useInfiniteQueryOMDb = (data: IQueryOMDbParams, enabled: boolean = true) => {
    return useInfiniteQuery({
        enabled,
        initialPageParam: 1,
        queryFn: ({ pageParam }) => {
            return queryOMDb({ ...data, pageNumber: pageParam });
        },
        getNextPageParam: (lastPage) => {
            if (
                lastPage.status === 'success' &&
                lastPage.data &&
                lastPage.data.currentPage < lastPage.data.totalPages
            ) {
                return lastPage.data.currentPage + 1;
            }
            return undefined;
        },
        queryKey: ['useInfiniteQueryOMDb', data.title],
    });
};
