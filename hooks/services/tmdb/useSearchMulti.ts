import { useQuery } from '@tanstack/react-query';
import { searchMulti } from '~/services/remote/tmdbService';

interface ISearchMultiParams {
    enabled?: boolean;
    searchQuery: string;
}

export const useSearchMulti = (data: ISearchMultiParams) => {
    return useQuery({
        queryKey: ['useSearchMulti', data.searchQuery],
        queryFn: () => searchMulti({ searchQuery: data.searchQuery }),
        enabled: data.enabled ?? true,
    });
};
