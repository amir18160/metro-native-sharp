import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface IProps {
    progress: number;
    color?: string;
    height?: number;
}

export default function SimpleProgressBar({ progress, color = '#3b82f6', height = 6 }: IProps) {
    const animatedProgress = useSharedValue(0);

    useEffect(() => {
        animatedProgress.value = withTiming(progress, { duration: 500 });
    }, [animatedProgress, progress]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${animatedProgress.value}%`,
        backgroundColor: color,
    }));

    return (
        <View style={{ height }} className="w-full overflow-hidden rounded-full bg-gray-200">
            <Animated.View style={[animatedStyle, { height }]} className="rounded-full" />
        </View>
    );
}
