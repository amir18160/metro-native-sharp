import { useQuery } from '@tanstack/react-query';
import { getLogList } from '~/services/remote/logsService';

export const useGetLogsList = () => {
  return useQuery({
    queryKey: ['getLogList'],
    queryFn: getLogList,
    staleTime: 1000 * 60 * 5,
  });
};
