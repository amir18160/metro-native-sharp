import { useQuery } from '@tanstack/react-query';
import { getLatestMovies } from '~/services/remote/scraperService';

export const useLatestMovies = (enabled: boolean = true) => {
    return useQuery({
        queryKey: ['latestMovies'],
        queryFn: getLatestMovies,
        enabled,
    });
};
