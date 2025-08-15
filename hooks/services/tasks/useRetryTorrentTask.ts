import { useMutation } from '@tanstack/react-query';
import { retryTorrentTask } from '~/services/remote/taskService';
import { Toast } from 'toastify-react-native';

export const useRetryTorrentTask = () => {
  return useMutation({
    mutationFn: retryTorrentTask,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'تلاش مجدد انجام شد.',
      });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'تلاش مجدد با خطا مواجه شد.',
      });
    },
  });
};
