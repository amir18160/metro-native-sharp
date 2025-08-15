import { useMutation } from '@tanstack/react-query';
import { CancelTorrentTask } from '~/services/remote/taskService';
import { Toast } from 'toastify-react-native';

export const useCancelTorrentTask = () => {
  return useMutation({
    mutationFn: CancelTorrentTask,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'تسک با موفقیت لغو شد.',
      });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'لغو تسک ناموفق بود.',
      });
    },
  });
};
