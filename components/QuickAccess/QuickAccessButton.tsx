import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector, Pressable } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import QuickAccessMenu from './QuickAccessMenu';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function QuickAccessButton() {
    const [isOpen, setIsOpen] = React.useState(false);

    const { width, height } = useWindowDimensions();

    // Track absolute position (starting near top-right)
    const translateX = useSharedValue(width - 60);
    const translateY = useSharedValue(80);

    // Save the starting position on touch begin
    const offsetX = useSharedValue(translateX.value);
    const offsetY = useSharedValue(translateY.value);

    const dragGesture = Gesture.Pan()
        .onStart(() => {
            offsetX.value = translateX.value;
            offsetY.value = translateY.value;
        })
        .onUpdate((event) => {
            // New tentative position
            const newX = offsetX.value + event.translationX;
            const newY = offsetY.value + event.translationY;

            // Clamp within screen bounds
            translateX.value = Math.min(Math.max(newX, 0), width - 60);
            translateY.value = Math.min(Math.max(newY, 0), height - 60);
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    }));

    return (
        <GestureDetector gesture={dragGesture}>
            <Animated.View style={animatedStyle} className="absolute z-50">
                <Pressable onPress={() => setIsOpen(!isOpen)}>
                    <MaterialIcons
                        className="h-12 w-12 rounded-full bg-indigo-500 text-center text-xs leading-[48px] text-white shadow-md"
                        name={isOpen ? 'expand-less' : 'expand-more'}
                        size={24}
                        color="white"
                    />
                </Pressable>
                {isOpen && <QuickAccessMenu />}
            </Animated.View>
        </GestureDetector>
    );
}
