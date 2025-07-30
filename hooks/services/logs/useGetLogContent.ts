import { useQuery } from '@tanstack/react-query';
import { getLogJson, logDTO } from '~/services/remote/logsService';

export const useGetLogContent = (data: logDTO) => {
  return useQuery({
    queryKey: ['getLogList'],
    queryFn: () => getLogJson(data),
  });
};
