import { useEffect, useState } from 'react';
import { useUserStore } from '~/stores/useUserStore';
import { useCustomFonts } from './useCustomFonts';
import { SplashScreen } from 'expo-router';
import { initializeFileSystem } from '~/utilities/InitializeFileSystem';
import * as NavigationBar from 'expo-navigation-bar';

SplashScreen.preventAutoHideAsync();

export const useIsAppReady = () => {
    initializeFileSystem();

    const [isAppReady, setIsAppReady] = useState(false);
    const hasHydratedUserStore = useUserStore((state) => state._hasHydrated);
    const { fontsLoaded, fontError } = useCustomFonts();

    useEffect(() => {
        const prepare = async () => {
            if (fontsLoaded && !fontError && hasHydratedUserStore) {
                await SplashScreen.hideAsync();
                await NavigationBar.setBackgroundColorAsync('#fff');

                setIsAppReady(true);
            }
        };
        prepare();
    }, [fontsLoaded, fontError, hasHydratedUserStore]);

    return isAppReady;
};
