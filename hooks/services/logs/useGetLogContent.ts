import { useQuery } from '@tanstack/react-query';
import { getDetails, logDTO } from '~/services/remote/logsService';

export const useGetLogContent = (data: logDTO) => {
  return useQuery({
    queryKey: ['getLogContent'],
    queryFn: () => getDetails(data),
    staleTime: 1000 * 3,
  });
};
