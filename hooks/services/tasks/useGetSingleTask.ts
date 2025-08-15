import { useQuery } from '@tanstack/react-query';
import { getSingleTask } from '~/services/remote/taskService';

export const useGetSingleTask = (id: string) => {
  return useQuery({
    queryKey: ['singleTask', id],
    queryFn: () => getSingleTask(id),
    enabled: !!id,
    staleTime: 1000 * 5,
  });
};
