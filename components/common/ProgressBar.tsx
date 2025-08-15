import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

type ProgressBarProps = {
    progress: number;
    color?: string;
};

export const ProgressBar = ({ progress, color = 'bg-indigo-500' }: ProgressBarProps) => {
    const animatedStyle = useAnimatedStyle(() => ({
        width: withTiming(`${progress}%`, { duration: 300, easing: Easing.inOut(Easing.ease) }),
    }));

    return (
        <View className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <Animated.View className={`h-full rounded-full ${color}`} style={animatedStyle} />
        </View>
    );
};
