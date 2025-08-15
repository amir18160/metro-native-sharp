import React, { useRef, useState } from 'react';
import {
    View,
    Pressable,
    ScrollView,
    TouchableWithoutFeedback,
    LayoutRectangle,
    Modal as RNModal,
    Dimensions,
} from 'react-native';
import Animated, { FadeInDown, FadeOutUp, FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../nativewindui/Text';
import { clsx } from 'clsx';

interface IProps {
    label?: string;
    selectedValue: string;
    labelColor?: string;
    onSelect: (value: string) => void;
    options: string[];
    error?: string;
    variant?: 'filled' | 'outlined' | 'minimal';
    maxHeight?: number;
    iconSize?: number;
    className?: string;
    size?: 'sx' | 'sm' | 'md' | 'lg' | 'xl'; // New size prop
}

export default function AnimatedPicker({
    label,
    labelColor,
    selectedValue,
    onSelect,
    options,
    error,
    variant = 'filled',
    maxHeight = 200,
    iconSize = 18,
    className,
    size = 'lg', // Default size
}: IProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [triggerLayout, setTriggerLayout] = useState<LayoutRectangle | null>(null);
    const [openUpwards, setOpenUpwards] = useState(false);
    const triggerRef = useRef<View>(null);

    const screenHeight = Dimensions.get('window').height;

    // Define size classes for trigger
    const sizeClassesTrigger: Record<NonNullable<typeof size>, string> = {
        sx: 'px-2 py-1',
        sm: 'px-3 py-4',
        md: 'px-3 py-6',
        lg: 'px-4 py-6',
        xl: 'p-4',
    };

    // Define size classes for option items
    const sizeClassesOption: Record<NonNullable<typeof size>, string> = {
        sx: 'px-2 py-1',
        sm: 'px-3 py-2',
        md: 'px-3 py-2.5',
        lg: 'px-4 py-3',
        xl: 'px-5 py-4',
    };

    // Define text size classes
    const textSizeClasses: Record<NonNullable<typeof size>, string> = {
        sx: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-base',
        xl: 'text-lg',
    };

    // Define border radius classes
    const borderRadiusClasses: Record<NonNullable<typeof size>, string> = {
        sx: 'rounded-sm',
        sm: 'rounded-md',
        md: 'rounded-lg',
        lg: 'rounded-2xl',
        xl: 'rounded-2xl',
    };

    const variantStyles = {
        filled: 'bg-neutral-900',
        outlined: 'bg-transparent border border-gray-500',
        minimal: 'bg-transparent border border-transparent',
    };

    const handleSelect = (value: string) => {
        onSelect(value);
        setIsOpen(false);
    };

    const toggleMenu = () => {
        if (triggerRef.current) {
            triggerRef.current.measure((_fx, _fy, width, height, px, py) => {
                const spaceBelow = screenHeight - (py + height);
                const spaceAbove = py;
                setTriggerLayout({ x: px, y: py, width, height });
                setOpenUpwards(spaceBelow < maxHeight && spaceAbove > spaceBelow);
                setIsOpen(!isOpen);
            });
        } else {
            setIsOpen(!isOpen);
        }
    };

    return (
        <View className={clsx('mb-4', className)}>
            {label && (
                <Text className={`$mb-2 font-semibold text-lg text-white ${labelColor}`}>
                    {label}
                </Text>
            )}

            {/* Picker Trigger */}
            <Pressable
                ref={triggerRef}
                onLayout={({ nativeEvent }) => setTriggerLayout(nativeEvent.layout)}
                onPress={toggleMenu}
                className={clsx(
                    'flex-row items-center justify-between shadow-lg',
                    variantStyles[variant],
                    borderRadiusClasses[size],
                    sizeClassesTrigger[size],
                    error ? 'border border-red-500' : ''
                )}>
                <Text className={clsx('text-white', textSizeClasses[size])}>{selectedValue}</Text>
                <Ionicons
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={iconSize}
                    color="#aaa"
                />
            </Pressable>

            {/* Dropdown Overlay */}
            <RNModal
                transparent
                visible={isOpen}
                animationType="none"
                onRequestClose={() => setIsOpen(false)}>
                <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
                    <View className="flex-1 bg-transparent">
                        {triggerLayout && (
                            <Animated.View
                                entering={openUpwards ? FadeInUp : FadeInDown}
                                exiting={openUpwards ? FadeOutDown : FadeOutUp}
                                style={{
                                    position: 'absolute',
                                    ...(openUpwards
                                        ? { bottom: screenHeight - triggerLayout.y + 4 }
                                        : { top: triggerLayout.y + triggerLayout.height + 4 }),
                                    left: triggerLayout.x,
                                    width: triggerLayout.width,
                                    zIndex: 9999,
                                }}
                                className={clsx(
                                    'border border-gray-700 bg-neutral-900 shadow-lg',
                                    borderRadiusClasses[size]
                                )}>
                                <ScrollView
                                    style={{ maxHeight }}
                                    contentContainerStyle={{ paddingVertical: 4 }}
                                    nestedScrollEnabled
                                    showsVerticalScrollIndicator={false}>
                                    {options.map((option) => (
                                        <Pressable
                                            key={option}
                                            className={clsx(
                                                'active:bg-gray-700',
                                                sizeClassesOption[size],
                                                textSizeClasses[size],
                                                option === selectedValue && 'bg-gray-800'
                                            )}
                                            onPress={() => handleSelect(option)}>
                                            <Text className="text-white">{option}</Text>
                                        </Pressable>
                                    ))}
                                </ScrollView>
                            </Animated.View>
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </RNModal>

            {error && <Text className="mt-1.5 text-xs italic text-red-400">{error}</Text>}
        </View>
    );
}
