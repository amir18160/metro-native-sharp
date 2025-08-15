import { useQuery } from '@tanstack/react-query';
import { getAllYtsMovies, IYtsSearchParams } from '~/services/remote/scraperService';

// useAllYtsMovies.ts
export const useAllYtsMovies = (params: IYtsSearchParams, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['allYtsMovies', params.Genre, params.SortBy, params.Page],
        queryFn: ({ queryKey }) => {
            const [, Genre, SortBy, Page] = queryKey;
            return getAllYtsMovies({ Genre, SortBy, Page } as IYtsSearchParams);
        },
        enabled,
        staleTime: 1000 * 60 * 2,
    });
};
