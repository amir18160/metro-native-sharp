import { useQuery } from '@tanstack/react-query';
import { getTorrentDetails, IGetTorrentDetailsParams } from '~/services/remote/scraperService';

export const useTorrentDetails = (params: IGetTorrentDetailsParams, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['torrentDetails', params],
        queryFn: () => getTorrentDetails(params),
        enabled,
    });
};
