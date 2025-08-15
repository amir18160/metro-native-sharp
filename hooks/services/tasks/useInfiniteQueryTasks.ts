import { useInfiniteQuery } from '@tanstack/react-query';
import { queryTasks, ITaskFilters } from '~/services/remote/taskService';

export const useInfiniteQueryTasks = (query: ITaskFilters) => {
    return useInfiniteQuery({
        queryKey: ['infiniteQueryTasks', query],
        refetchInterval: 1000 * 1,
        queryFn: ({ pageParam = 1 }) => queryTasks({ ...query, pageNumber: pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.status === 'success' && lastPage.data) {
                const { pageNumber, totalPages } = lastPage.data;
                if (pageNumber < totalPages) {
                    return pageNumber + 1;
                }
            }
            return undefined;
        },
    });
};
