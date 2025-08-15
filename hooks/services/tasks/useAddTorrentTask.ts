import { useMutation } from '@tanstack/react-query';
import { addTorrentTask } from '~/services/remote/taskService';
import { Toast } from 'toastify-react-native';

export const useAddTorrentTask = () => {
  return useMutation({
    mutationFn: addTorrentTask,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'تسک جدید با موفقیت افزوده شد.',
      });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'افزودن تسک ناموفق بود.',
      });
    },
  });
};
