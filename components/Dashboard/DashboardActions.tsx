// DashboardActions.tsx
import React from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withDelay,
} from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

type ActionButtonProps = {
    icon: string;
    label: string;
    color: string;
    index: number;
    onPress: () => void;
};

function ActionButton({ icon, label, color, index, onPress }: ActionButtonProps) {
    const scale = useSharedValue(0.8);
    const opacity = useSharedValue(0);

    React.useEffect(() => {
        scale.value = withDelay(index * 80, withSpring(1, { damping: 12 }));
        opacity.value = withDelay(index * 80, withSpring(1));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={animatedStyle}
            className="mb-4 w-[30%] items-center justify-center rounded-xl bg-white p-4 shadow-sm">
            <Pressable
                onPress={onPress}
                className="items-center justify-center"
                android_ripple={{ color: '#e5e7eb', borderless: false }}>
                <View className={`h-12 w-12 rounded-full ${color} items-center justify-center`}>
                    <MaterialIcons name={icon as any} size={22} color="white" />
                </View>
                <Text className="mt-2 text-center font-medium text-xs text-gray-900">{label}</Text>
            </Pressable>
        </Animated.View>
    );
}

export default function DashboardActions() {
    const router = useRouter();

    const actions = [
        {
            icon: 'add-link',
            label: 'Add Magnet',
            color: 'bg-indigo-500',
            route: '/(tasks)/AddTaskForm',
        },
        {
            icon: 'analytics',
            label: 'Logs',
            color: 'bg-rose-500',
            route: '/(drawer)/(admin)/(tabs)/Logs',
        },
        {
            icon: 'tag',
            label: 'Add Tags',
            color: 'bg-emerald-500',
            route: '/(drawer)/(admin)/(tabs)/Tags',
        },
        {
            icon: 'download-for-offline',
            label: 'Progress',
            color: 'bg-orange-500',
            route: '/(drawer)/(admin)/(tabs)/TasksProgress',
        },
        {
            icon: 'telegram',
            label: 'Open Channel',
            color: 'bg-blue-500',
            url: process.env.EXPO_PUBLIC_CHANNEL_ADDRESS,
        },
        {
            icon: 'chrome-reader-mode',
            label: 'Open Website',
            color: 'bg-slate-500',
            url: process.env.EXPO_PUBLIC_WEB_ADDRESS,
        },
    ];

    const handlePress = (action: (typeof actions)[number]) => {
        if (action.url) {
            Linking.openURL(action.url).catch((err) => console.error('Failed to open URL', err));
        } else if (action.route) {
            router.push(action.route as any);
        }
    };

    return (
        <View className="flex-1 bg-gray-100 p-4">
            <Text className="mb-3 font-bold text-xl text-gray-900">⚡ Dashboard Actions</Text>

            <View className="flex flex-row flex-wrap justify-between">
                {actions.map((action, index) => (
                    <ActionButton
                        key={action.label}
                        index={index}
                        icon={action.icon}
                        label={action.label}
                        color={action.color}
                        onPress={() => handlePress(action)}
                    />
                ))}
            </View>
        </View>
    );
}
