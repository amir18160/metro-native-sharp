import { useQuery } from '@tanstack/react-query';
import { ISearchScraperParams, searchYts } from '~/services/remote/scraperService';

export const useSearchYts = (params: ISearchScraperParams, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['searchYts', params],
        queryFn: () => searchYts(params),
        enabled,
    });
};
