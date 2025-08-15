import React from 'react';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Text } from '../nativewindui/Text';

interface AnimatedStatusBoxProps {
    status: 'idle' | 'warn' | 'success' | 'error';
    message: string;
    className?: string;
    emptyOnIdle?: boolean;
}

export function AnimatedStatusBox({
    status,
    message,
    className = '',
    emptyOnIdle = false,
}: AnimatedStatusBoxProps) {
    const statusColors = {
        idle: 'bg-gray-700',
        warn: 'bg-yellow-600',
        success: 'bg-green-600',
        error: 'bg-red-600',
    };

    if (status === 'idle' && emptyOnIdle) return null;

    return (
        <Animated.View
            entering={FadeInDown}
            exiting={FadeOutUp}
            className={`rounded-xl p-3 ${statusColors[status]} ${className}`}>
            <Text className="text-center text-white">{message}</Text>
        </Animated.View>
    );
}
