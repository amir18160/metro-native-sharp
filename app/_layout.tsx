import '../global.css';
import 'expo-dev-client';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { DevToolsBubble } from 'react-native-react-query-devtools';

import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { PortalProvider } from '@gorhom/portal';

import { useInitialAndroidBarSync } from '~/hooks/general/useColorScheme';
import { NAV_THEME } from '~/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '~/components/Toast/ToastProvider';
import { useIsAppReady } from '~/hooks/general/useIsAppReady';

import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ModalProvider from '~/providers/ModalProvider';
import { AuthRedirector } from '~/components/Auth/AuthRedirector';
import CustomStatusBar from '~/components/StatusBar/CustomStatusBar';

export { ErrorBoundary } from 'expo-router';

const queryClient = new QueryClient();

export default function RootLayout() {
    useInitialAndroidBarSync();
    const isAppReady = useIsAppReady();

    if (!isAppReady) {
        return null;
    }

    return (
        <>
            <CustomStatusBar />

            <QueryClientProvider client={queryClient}>
                <PortalProvider>
                    <ModalProvider>
                        <AuthRedirector />
                        <NavThemeProvider value={NAV_THEME['light']}>
                            <GestureHandlerRootView style={styles.flex}>
                                <Stack screenOptions={SCREEN_OPTIONS}>
                                    <Stack.Screen name="index" options={INDEX_OPTIONS} />
                                    <Stack.Screen
                                        name="(drawer)"
                                        options={{ headerShown: false }}
                                    />
                                    <Stack.Screen
                                        name="(browser)/Browser"
                                        options={{ headerShown: false }}
                                    />
                                    <Stack.Screen
                                        name="(tasks)/AddTaskForm"
                                        options={{
                                            title: 'Add Task',
                                        }}
                                    />
                                    <Stack.Screen
                                        name="(telegram)/SendNotification"
                                        options={{
                                            title: 'Send Notification',
                                        }}
                                    />
                                    <Stack.Screen
                                        name="(telegram)/ForwardedFiles"
                                        options={{
                                            title: 'Forwarded Files',
                                        }}
                                    />
                                    <Stack.Screen
                                        name="(documents)/UpdateDocuments"
                                        options={{
                                            title: 'Update Documents',
                                        }}
                                    />
                                </Stack>
                            </GestureHandlerRootView>
                        </NavThemeProvider>
                    </ModalProvider>
                    {process.env.EXPO_PUBLIC_NODE_ENV === 'development' && (
                        <DevToolsBubble queryClient={queryClient} />
                    )}
                    <ToastProvider />
                </PortalProvider>
            </QueryClientProvider>
        </>
    );
}

type IScreenOptions = React.ComponentProps<typeof Stack>['screenOptions'];
const SCREEN_OPTIONS: IScreenOptions = {
    animation: 'ios_from_right',
    headerStyle: { backgroundColor: '#6366f1' },
    headerTitleStyle: { color: '#fff' },
    headerTintColor: '#fff',
    headerLargeTitle: true,
    headerTransparent: false,
};

const INDEX_OPTIONS = {
    headerLargeTitle: true,
    title: 'MetroMoviez',
} as const;

const styles = StyleSheet.create({
    flex: { flex: 1 },
});
