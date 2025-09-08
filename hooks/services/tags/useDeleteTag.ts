import { useMutation } from '@tanstack/react-query';
import { deleteTag } from '~/services/remote/tagService';

export const useDeleteTag = () => {
    return useMutation({
        mutationFn: deleteTag,
    });
};
