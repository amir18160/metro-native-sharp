import { useInfiniteQuery } from '@tanstack/react-query';
import { getTempDocuments } from '~/services/remote/documentServices';

export const useGetTempDocuments = () => {
    return useInfiniteQuery({
        queryKey: ['useGetTempDocuments'],
        queryFn: ({ pageParam }) => getTempDocuments({ pageNumber: pageParam }),
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
