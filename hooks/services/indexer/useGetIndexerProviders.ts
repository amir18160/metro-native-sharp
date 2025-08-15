import { useQuery } from '@tanstack/react-query';
import { getIndexerProvidersList } from '~/services/remote/indexerService';

export const useGetIndexerProviders = () => {
    return useQuery({
        queryFn: getIndexerProvidersList,
        queryKey: ['indexer-providers-list'],
    });
};
