import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    withSequence,
    withDelay,
} from 'react-native-reanimated';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Text } from '~/components/nativewindui/Text';
import { clsx } from 'clsx';

interface AnimatedTextFieldProps {
    value: string;
    labelColor?: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    label?: string;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    className?: string;
    secureTextEntry?: boolean;
    variant?: 'default' | 'search' | 'magnet' | 'password';
    size?: 'sx' | 'sm' | 'md' | 'lg' | 'xl';
    showPasteButton?: boolean;
    required?: boolean;
    errorMessage?: string;
    disabled?: boolean;
    removeButton?: boolean;
    onRemove?: () => void;
}

export default function AnimatedTextField({
    value,
    onChangeText,
    labelColor = undefined,
    placeholder,
    label,
    iconLeft,
    iconRight,
    className,
    secureTextEntry = false,
    variant = 'default',
    size = 'lg',
    showPasteButton = false,
    required = false,
    errorMessage = '',
    disabled = false,
    removeButton = true,
    onRemove = undefined,
}: AnimatedTextFieldProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

    const opacity = useSharedValue(0);
    const translateY = useSharedValue(10);
    const scale = useSharedValue(1);
    const shake = useSharedValue(0);
    const errorOpacity = useSharedValue(0);
    const errorTranslateY = useSharedValue(-4);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 400 });
        translateY.value = withSpring(0, { damping: 12 });
    }, [opacity, translateY]);

    useEffect(() => {
        if (errorMessage) {
            shake.value = withSequence(
                withSpring(-4, { damping: 5 }),
                withSpring(4, { damping: 5 }),
                withSpring(-2, { damping: 5 }),
                withSpring(0, { damping: 5 })
            );
            errorOpacity.value = withDelay(100, withTiming(1, { duration: 300 }));
            errorTranslateY.value = withTiming(0, { duration: 300 });
        } else {
            errorOpacity.value = withTiming(0, { duration: 200 });
            errorTranslateY.value = withTiming(-4, { duration: 200 });
        }
    }, [errorMessage, errorOpacity, errorTranslateY, shake]);

    const containerStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    const buttonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const inputWrapperStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shake.value }],
    }));

    const errorTextStyle = useAnimatedStyle(() => ({
        opacity: errorOpacity.value,
        transform: [{ translateY: errorTranslateY.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.9);
    };
    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    // Variant base styles (no padding/border radius here anymore)
    const variantClasses: Record<NonNullable<typeof variant>, string> = {
        default: 'bg-neutral-900',
        search: 'bg-neutral-800',
        magnet: 'bg-neutral-900 border border-indigo-500',
        password: 'bg-neutral-900',
    };

    // Size styles: padding + text size + border radius
    const sizeClasses: Record<NonNullable<typeof size>, string> = {
        sx: 'px-2 py-1 text-xs rounded-md',
        sm: 'px-3 py-2 text-sm rounded-lg',
        md: 'px-3 py-2.5 text-base rounded-xl',
        lg: 'p-3 text-base rounded-2xl', // current default
        xl: 'p-4 text-lg rounded-3xl',
    };

    const handlePaste = async () => {
        const text = await Clipboard.getStringAsync();
        if (text) onChangeText(text);
    };

    const isError = !!errorMessage;

    return (
        <Animated.View style={containerStyle} className={clsx('w-full', className)}>
            {label && (
                <View className="mb-2 flex-row items-center justify-between">
                    <Text className={`font-semibold text-lg text-white ${labelColor}`}>
                        {label}
                    </Text>
                    {required && <Text className="text-lg text-red-500">*</Text>}
                </View>
            )}

            <Animated.View
                style={inputWrapperStyle}
                className={clsx(
                    'flex-row items-center shadow-lg',
                    variantClasses[variant],
                    sizeClasses[size],
                    isError ? 'border border-red-500' : ''
                )}>
                {iconLeft && <View className="mr-2">{iconLeft}</View>}

                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#9ca3af"
                    className={clsx('flex-1 text-white', sizeClasses[size])}
                    secureTextEntry={!isPasswordVisible && secureTextEntry}
                    editable={!disabled}
                />

                {showPasteButton && (
                    <Animated.View style={buttonStyle}>
                        <TouchableOpacity
                            onPress={handlePaste}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-neutral-700">
                            <MaterialIcons name="content-paste" size={16} color="white" />
                        </TouchableOpacity>
                    </Animated.View>
                )}

                {removeButton && value?.length > 0 && variant !== 'password' && (
                    <Animated.View style={buttonStyle}>
                        <TouchableOpacity
                            onPress={() => {
                                if (onRemove) {
                                    onRemove();
                                    return;
                                }
                                onChangeText('');
                            }}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-neutral-700">
                            <Ionicons name="close" size={16} color="white" />
                        </TouchableOpacity>
                    </Animated.View>
                )}

                {variant === 'password' && (
                    <Animated.View style={buttonStyle}>
                        <TouchableOpacity
                            onPress={() => setIsPasswordVisible((prev) => !prev)}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            className="ml-2 h-8 w-8 items-center justify-center rounded-full bg-neutral-700">
                            <Ionicons
                                name={isPasswordVisible ? 'eye-off' : 'eye'}
                                size={18}
                                color="white"
                            />
                        </TouchableOpacity>
                    </Animated.View>
                )}

                {iconRight && <View className="ml-2">{iconRight}</View>}
            </Animated.View>

            {isError && (
                <Animated.View style={errorTextStyle}>
                    <Text className="mt-1 text-xs italic text-red-400">{errorMessage}</Text>
                </Animated.View>
            )}
        </Animated.View>
    );
}
