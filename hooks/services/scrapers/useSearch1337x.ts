import { useQuery } from '@tanstack/react-query';
import { ISearchScraperParams, search1337x } from '~/services/remote/scraperService';

export const useSearch1337x = (params: ISearchScraperParams, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['search1337x', params],
        queryFn: () => search1337x(params),
        enabled,
    });
};
