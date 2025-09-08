import { useMutation } from '@tanstack/react-query';
import { updateTempDocument } from '~/services/remote/documentServices';

export const useUpdateTempDocument = () => {
    return useMutation({
        mutationFn: updateTempDocument,
    });
};
