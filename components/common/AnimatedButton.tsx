import React, { useCallback } from 'react';
import {
    Pressable,
    ActivityIndicator,
    View,
    GestureResponderEvent,
    StyleProp,
    ViewStyle,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    FadeInUp,
    FadeOutUp,
} from 'react-native-reanimated';
import { clsx } from 'clsx';
import { Text } from '../nativewindui/Text';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';

interface AnimatedButtonProps {
    title?: string | React.ReactNode;
    onPress?: (e?: GestureResponderEvent) => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string; // extra tailwind classes
    color?: string; // custom background color (overrides variant bg)
    textColor?: string; // custom text color
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    isLoading?: boolean;
    loadingPosition?: 'left' | 'right' | 'center';
    disabled?: boolean;
    style?: StyleProp<ViewStyle>; // fallback style prop
    testID?: string;
    accessibilityLabel?: string;
    containerClass?: string;
}

/**
 * Extremely comprehensive AnimatedButton:
 * - supports sizes, variants, custom color, icons, loading states, disabled
 * - press animation (scale)
 * - entering/exiting animations
 * - accessible props
 */
export function AnimatedButton({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    className = '',
    color,
    textColor,
    leftIcon,
    rightIcon,
    isLoading = false,
    loadingPosition = 'left',
    disabled = false,
    style,
    testID,
    accessibilityLabel,
    containerClass = '',
}: AnimatedButtonProps) {
    // scale shared value for press feedback
    const scale = useSharedValue(1);

    const handlePressIn = useCallback(() => {
        scale.value = withSpring(0.96, { damping: 12, stiffness: 150 });
    }, [scale]);

    const handlePressOut = useCallback(() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 150 });
    }, [scale]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    // size classes
    const sizeMap: Record<ButtonSize, string> = {
        xs: 'px-2 py-1 rounded-md',
        sm: 'px-3 py-2 rounded-lg',
        md: 'px-4 py-3 rounded-xl',
        lg: 'px-5 py-4 rounded-2xl',
        xl: 'px-6 py-4 rounded-2xl',
    };

    const textSizeMap: Record<ButtonSize, string> = {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-lg',
    };

    // variant -> base classes (you can tweak these to match your theme)
    const variantMap: Record<ButtonVariant, string> = {
        primary: 'bg-indigo-600 shadow-md',
        secondary: 'bg-neutral-800 shadow-sm',
        ghost: 'bg-transparent',
        danger: 'bg-red-600 shadow-md',
        outline: 'bg-transparent border border-neutral-700',
    };

    // text color defaults
    const defaultTextColor =
        textColor ?? (variant === 'ghost' || variant === 'outline' ? 'text-white' : 'text-white');

    // compute composed classes
    const baseClasses = clsx(
        'flex-row items-center justify-center',
        sizeMap[size],
        textSizeMap[size],
        // If user passed custom color string, we still include typical padding/rounding but not variant bg class.
        !color ? variantMap[variant] : 'shadow-md',
        !color && variant === 'ghost' ? 'px-2' : '',
        disabled || isLoading ? 'opacity-70' : 'opacity-100',
        className
    );

    // When a custom color is provided, we will set backgroundColor style; else rely on tailwind class.
    const overrideStyle: StyleProp<ViewStyle> = [
        style,
        color ? { backgroundColor: color } : undefined,
    ];

    const spinnerColor = (() => {
        if (textColor) return textColor === 'text-black' ? '#000' : undefined; // not perfect but fallback
        // For dark backgrounds, white spinner looks good.
        return '#fff';
    })();

    const showSpinnerCenter = isLoading && loadingPosition === 'center';
    const disablePress = disabled || isLoading;

    return (
        <Animated.View
            entering={FadeInUp.duration(200)}
            exiting={FadeOutUp.duration(120)}
            style={animatedStyle}
            className={`overflow-hidden ${containerClass}`}>
            <Pressable
                onPress={disablePress ? undefined : onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                android_ripple={{ color: 'rgba(255,255,255,0.06)' }}
                className={baseClasses}
                style={overrideStyle}
                testID={testID}
                accessible
                accessibilityRole="button"
                accessibilityState={{ disabled: !!disablePress }}
                accessibilityLabel={accessibilityLabel}>
                {/* CENTER SPINNER (replaces content) */}
                {showSpinnerCenter ? (
                    <ActivityIndicator size="small" color={spinnerColor} />
                ) : (
                    <>
                        {/* LEFT ICON OR LEFT-SPINNER */}
                        {isLoading && loadingPosition === 'left' ? (
                            <ActivityIndicator
                                size="small"
                                color={spinnerColor}
                                style={{ marginRight: 8 }}
                            />
                        ) : leftIcon ? (
                            <View style={{ marginRight: 8 }}>{leftIcon}</View>
                        ) : null}

                        {/* Title / Custom content */}
                        {typeof title === 'string' ? (
                            <Text className={clsx(defaultTextColor, 'font-semibold')}>{title}</Text>
                        ) : (
                            (title ?? null)
                        )}

                        {/* RIGHT ICON OR RIGHT-SPINNER */}
                        {isLoading && loadingPosition === 'right' ? (
                            <ActivityIndicator
                                size="small"
                                color={spinnerColor}
                                style={{ marginLeft: 8 }}
                            />
                        ) : rightIcon ? (
                            <View style={{ marginLeft: 8 }}>{rightIcon}</View>
                        ) : null}
                    </>
                )}
            </Pressable>
        </Animated.View>
    );
}
