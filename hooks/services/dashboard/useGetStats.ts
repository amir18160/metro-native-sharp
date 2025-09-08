import { useQuery } from '@tanstack/react-query';
import { getStats } from '~/services/remote/dashboardService';

export const useGetStats = () => {
    return useQuery({
        queryKey: ['useGetStats'],
        queryFn: getStats,
        refetchInterval: 20 * 1000,
        retryDelay: 2000,
    });
};
