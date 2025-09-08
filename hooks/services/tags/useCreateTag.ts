import { useMutation } from '@tanstack/react-query';
import { createTag } from '~/services/remote/tagService';

export const useCreateTag = () => {
    return useMutation({
        mutationFn: createTag,
    });
};
