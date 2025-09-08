import { useMutation } from '@tanstack/react-query';
import { addTorrentTask } from '~/services/remote/taskService';
export const useAddTorrentTask = () => {
    return useMutation({
        mutationFn: addTorrentTask,
    });
};
