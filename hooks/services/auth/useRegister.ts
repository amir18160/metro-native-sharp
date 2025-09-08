import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Toast } from 'toastify-react-native';
import { register } from '~/services/remote/authService';
import { modal } from '~/stores/useAnimatedModalCenterStore';
import { useUserStore } from '~/stores/useUserStore';

export const useRegister = () => {
    const router = useRouter();
    const setUser = useUserStore((store) => store.setUser);

    return useMutation({
        mutationFn: register,
        onSuccess: (data) => {
            if (data.data) {
                setUser(data.data);
            }

            router.replace('/(drawer)/(user)/Home');

            Toast.show({
                type: 'success',
                text1: 'به جمع ما خوش اومدید!',
                onHide: () => {
                    router.replace('/');
                },
            });

            Toast.show({
                type: 'success',
                text1: 'به جمع ما خوش اومدید!',
            });
        },

        onError: (error) => {
            modal.show({
                title: 'خطا',
                message: 'رکب خوردیم که! بعدا تلاش کنید.',
            });
        },
    });
};
