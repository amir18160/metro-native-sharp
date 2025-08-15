import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useUserStore } from '~/stores/useUserStore';

export function AuthRedirector() {
    const router = useRouter();
    const segments = useSegments();
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        const inAuthGroup = segments[0] === '(auth)';

        if (!user && !inAuthGroup) {
            router.replace('/(auth)/Login');
        }
    }, [segments, user, router]);

    return null;
}
