import { StatusBar } from 'react-native';
import { useSegments } from 'expo-router';

export default function CustomStatusBar() {
    const segments = useSegments();
    const isDrawerOpen = segments[0] === '(drawer)';

    if (isDrawerOpen) {
        return <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />;
    }

    return <StatusBar barStyle="light-content" backgroundColor="#6366f1" />;
}
