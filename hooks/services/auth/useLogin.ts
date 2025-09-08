import { useMutation } from '@tanstack/react-query';
import { login } from '~/services/remote/authService';
import { useRouter } from 'expo-router';
import { useUserStore } from '~/stores/useUserStore';
import { modal } from '~/stores/useAnimatedModalCenterStore';

export const useLogin = () => {
    const router = useRouter();
    const setUser = useUserStore((store) => store.setUser);

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            if (data.data) {
                setUser(data.data);
            }

            router.replace('/(drawer)/(user)/Home');

            modal.success({
                title: 'موفق',
                message: 'خوش برگشتید!  ورود با موفقیت انجام شد.',
            });
        },

        onError: (error) => {
            modal.error({
                title: 'ناموفق',
                message: 'ناموفق، لطفا نام کاربری و رمز عبور خود را بررسی کنید.',
            });
        },
    });
};
