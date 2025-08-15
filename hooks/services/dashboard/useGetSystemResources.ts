import { useQuery } from '@tanstack/react-query';
import { getSystemResources } from '~/services/remote/dashboardService';

export const useGetSystemResources = () => {
    return useQuery({
        queryKey: ['get-system-resources'],
        queryFn: () => getSystemResources(),
        refetchInterval: 30 * 1000,
    });
};
