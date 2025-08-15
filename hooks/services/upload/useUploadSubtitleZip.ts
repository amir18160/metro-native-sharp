import { useMutation } from '@tanstack/react-query';
import { uploadZipSubtitle } from '~/services/remote/uploadService';

export const useUploadSubtitleZip = () => {
    return useMutation({
        mutationFn: uploadZipSubtitle,
    });
};
