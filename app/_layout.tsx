import '../global.css';
import 'expo-dev-client';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Icon } from '@roninoss/icons';
import { DevToolsBubble } from 'react-native-react-query-devtools';

import { Link, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, View } from 'react-native';

import { PortalProvider } from '@gorhom/portal';

import { ThemeToggle } from '~/components/ThemeToggle';
import { cn } from '~/utilities/cn';
import { useColorScheme, useInitialAndroidBarSync } from '~/hooks/general/useColorScheme';
import { NAV_THEME } from '~/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '~/components/Toast/ToastProvider';
import { useIsAppReady } from '~/hooks/general/useIsAppReady';

import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ModalProvider from '~/providers/ModalProvider';
import { AuthRedirector } from '~/components/Auth/AuthRedirector';

export { ErrorBoundary } from 'expo-router';

const queryClient = new QueryClient();

export default function RootLayout() {
    useInitialAndroidBarSync();
    const { colorScheme, isDarkColorScheme } = useColorScheme();
    const isAppReady = useIsAppReady();

    if (!isAppReady) {
        return null;
    }

    return (
        <>
            <StatusBar
                key={`root-status-bar-${isDarkColorScheme ? 'light' : 'dark'}`}
                style={isDarkColorScheme ? 'light' : 'dark'}
            />

            <QueryClientProvider client={queryClient}>
                <PortalProvider>
                    <ModalProvider>
                        <AuthRedirector />
                        <NavThemeProvider value={NAV_THEME[colorScheme]}>
                            <GestureHandlerRootView style={{ flex: 1 }}>
                                <Stack screenOptions={SCREEN_OPTIONS}>
                                    <Stack.Screen name="index" options={INDEX_OPTIONS} />
                                    <Stack.Screen name="modal" options={MODAL_OPTIONS} />
                                    <Stack.Screen
                                        name="(drawer)"
                                        options={{ headerShown: false }}
                                    />
                                    <Stack.Screen
                                        name="(browser)/Browser"
                                        options={{ headerShown: false }}
                                    />
                                </Stack>
                            </GestureHandlerRootView>
                        </NavThemeProvider>
                    </ModalProvider>
                    <DevToolsBubble queryClient={queryClient} />
                    <ToastProvider />
                </PortalProvider>
            </QueryClientProvider>
        </>
    );
}

const SCREEN_OPTIONS = {
    animation: 'ios_from_right',
    navigationBarColor: '#000',
} as const;

const INDEX_OPTIONS = {
    headerLargeTitle: true,
    title: 'NativeWindUI',
    headerRight: () => <SettingsIcon />,
} as const;

function SettingsIcon() {
    const { colors } = useColorScheme();
    return (
        <Link href="/modal" asChild>
            <Pressable className="opacity-80">
                {({ pressed }) => (
                    <View className={cn(pressed ? 'opacity-50' : 'opacity-90')}>
                        <Icon name="cog-outline" color={colors.foreground} />
                    </View>
                )}
            </Pressable>
        </Link>
    );
}

const MODAL_OPTIONS = {
    presentation: 'modal',
    animation: 'fade_from_bottom',
    title: 'Settings',
    headerRight: () => <ThemeToggle />,
} as const;
