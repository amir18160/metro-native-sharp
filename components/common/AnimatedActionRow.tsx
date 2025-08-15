import React from 'react';
import { View, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Text } from '../nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';

type ButtonConfig = {
    title: string;
    icon?: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    className?: string;
};

type StatusType = 'idle' | 'loading' | 'success' | 'error';

type Props = {
    leftButton: ButtonConfig;
    rightButton: ButtonConfig;
    status?: {
        type: StatusType;
        message?: string;
    };
};

const StatusColors: Record<StatusType, string> = {
    idle: 'bg-neutral-700',
    loading: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
};

export default function AnimatedActionRow({
    leftButton,
    rightButton,
    status = { type: 'idle', message: '' },
}: Props) {
    const Button = ({ config }: { config: ButtonConfig }) => (
        <Pressable
            onPress={config.onPress}
            className={`flex-row items-center justify-center rounded-xl bg-neutral-800 px-4 py-3 transition-all active:scale-95 ${config.className || ''}`}>
            {config.icon && (
                <Ionicons name={config.icon} size={18} color="white" style={{ marginRight: 6 }} />
            )}
            <Text className="font-semibold text-white">{config.title}</Text>
        </Pressable>
    );

    return (
        <View className="gap-3">
            {/* Buttons Row */}
            <View className="flex-row gap-3">
                <Button config={leftButton} />
                <Button config={rightButton} />
            </View>

            {/* Status Box */}
            {status?.message ? (
                <Animated.View
                    entering={FadeInDown.springify().damping(15)}
                    exiting={FadeOutUp}
                    className={`rounded-lg p-3 ${StatusColors[status.type]} shadow-md`}>
                    <Text className="font-medium text-sm text-white">{status.message}</Text>
                </Animated.View>
            ) : null}
        </View>
    );
}
