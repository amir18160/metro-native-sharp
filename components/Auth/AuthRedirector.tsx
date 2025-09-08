import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useUserStore } from '~/stores/useUserStore';

export function AuthRedirector() {
    const router = useRouter();
    const segments = useSegments();
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        const inAuthGroup = segments[0] === '(auth)';
        const isSettingsGroup = segments[1] === '(settings)';

        if (!user) {
            if (isSettingsGroup) {
                return;
            }

            if (!inAuthGroup) {
                router.replace('/(auth)/Login');
            }
        }
    }, [segments, user, router]);

    return null;
}
