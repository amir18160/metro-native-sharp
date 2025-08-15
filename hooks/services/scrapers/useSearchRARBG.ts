import { useQuery } from '@tanstack/react-query';
import { ISearchScraperParams, searchRARBG } from '~/services/remote/scraperService';

export const useSearchRARBG = (params: ISearchScraperParams, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['searchRARBG', params],
        queryFn: () => searchRARBG(params),
        enabled,
    });
};
