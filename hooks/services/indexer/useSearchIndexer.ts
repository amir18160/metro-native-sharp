import { useMutation } from '@tanstack/react-query';
import { Toast } from 'toastify-react-native';
import { searchIndexer } from '~/services/remote/indexerService';

export const useSearchIndexer = () => {
    return useMutation({
        mutationFn: searchIndexer,
        onError: (error) => {
            Toast.show({
                type: 'error',
                text1: 'رکب خوردیم که! بعدا تلاش کنید.',
            });
        },
    });
};
