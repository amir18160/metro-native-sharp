// QuickAccessButton.tsx
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector, Pressable } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import QuickAccessMenu from './QuickAccessMenu';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function QuickAccessButton() {
    const [isOpen, setIsOpen] = React.useState(false);

    const { width, height } = useWindowDimensions();

    // Track absolute position (starting near top-right)
    const translateX = useSharedValue(width - 60);
    const translateY = useSharedValue(40);

    // For button rotation animation
    const rotation = useSharedValue(0);

    // Save the starting position on touch begin
    const offsetX = useSharedValue(translateX.value);
    const offsetY = useSharedValue(translateY.value);

    const dragGesture = Gesture.Pan()
        .onStart(() => {
            offsetX.value = translateX.value;
            offsetY.value = translateY.value;
        })
        .onUpdate((event) => {
            const newX = offsetX.value + event.translationX;
            const newY = offsetY.value + event.translationY;

            // Clamp inside screen
            translateX.value = Math.min(Math.max(newX, 0), width - 60);
            translateY.value = Math.min(Math.max(newY, 0), height - 60);
        })
        .onEnd(() => {
            // Bounce when released
            translateX.value = withSpring(translateX.value, { damping: 15 });
            translateY.value = withSpring(translateY.value, { damping: 15 });
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    }));

    const iconStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
        rotation.value = withSpring(isOpen ? 0 : 180, { damping: 12 });
    };

    return (
        <GestureDetector gesture={dragGesture}>
            <Animated.View style={animatedStyle} className="absolute z-50 items-center">
                <Pressable onPress={toggleMenu}>
                    <Animated.View
                        className="h-14 w-14 items-center justify-center rounded-full bg-indigo-500 shadow-lg"
                        style={iconStyle}>
                        <MaterialIcons name="expand-less" size={28} color="white" />
                    </Animated.View>
                </Pressable>

                {/* Animated Menu */}
                <QuickAccessMenu isOpen={isOpen} />
            </Animated.View>
        </GestureDetector>
    );
}
