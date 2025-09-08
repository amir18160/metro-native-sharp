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
                const { currentPage, totalPages } = lastPage.data;
                if (currentPage < totalPages) {
                    return currentPage + 1;
                }
            }
            return undefined;
        },
    });
};
