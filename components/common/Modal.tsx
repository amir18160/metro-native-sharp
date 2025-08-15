import { Portal } from '@gorhom/portal';
import { ReactElement, useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    Pressable,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    Easing,
    interpolate,
    Extrapolate,
    runOnJS,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.85;

interface IModalProps {
    title: string;
    visible: boolean;
    children: ReactElement;
    scrollable?: boolean;
    onClose: () => void;
}

export default function Modal({
    title,
    visible,
    onClose,
    children,
    scrollable = true,
}: IModalProps) {
    const [isMounted, setIsMounted] = useState(visible);

    const translateY = useSharedValue(MODAL_HEIGHT);
    const backdropOpacity = useSharedValue(0);
    const scale = useSharedValue(0.95);
    const borderRadius = useSharedValue(32);

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: backdropOpacity.value,
    }));

    const modalStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }, { scale: scale.value }],
        borderTopLeftRadius: borderRadius.value,
        borderTopRightRadius: borderRadius.value,
    }));

    const contentStyle = useAnimatedStyle(() => ({
        opacity: interpolate(translateY.value, [MODAL_HEIGHT / 2, 0], [0, 1], Extrapolate.CLAMP),
        transform: [
            {
                translateY: interpolate(
                    translateY.value,
                    [0, MODAL_HEIGHT],
                    [0, 20],
                    Extrapolate.CLAMP
                ),
            },
        ],
    }));

    useEffect(() => {
        const config = {
            damping: 25,
            stiffness: 300,
            mass: 0.8,
            easing: Easing.bezier(0.17, 0.67, 0.83, 0.67),
        };

        if (visible) {
            setIsMounted(true);
            backdropOpacity.value = withTiming(1, { duration: 300 });
            translateY.value = withSpring(0, config, () => {
                scale.value = withSpring(1, { damping: 10, stiffness: 200 });
                borderRadius.value = withTiming(24, { duration: 200 });
            });
        } else {
            backdropOpacity.value = withTiming(0, { duration: 300 });
            scale.value = withTiming(0.95, { duration: 200 });
            borderRadius.value = withTiming(32, { duration: 200 });
            translateY.value = withSpring(MODAL_HEIGHT, { ...config, velocity: 2 }, (finished) => {
                if (finished) {
                    runOnJS(setIsMounted)(false);
                    runOnJS(onClose)();
                }
            });
        }
    }, [backdropOpacity, borderRadius, onClose, scale, translateY, visible]);

    if (!isMounted) return null;

    return (
        <Portal>
            <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
                {/* Animated Backdrop */}
                <Animated.View
                    style={[StyleSheet.absoluteFillObject, styles.backdrop, backdropStyle]}
                />

                {/* Touchable Backdrop */}
                <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />

                {/* Modal Content */}
                <Animated.View style={[styles.modalContainer, modalStyle]}>
                    {/* Handle Bar */}
                    <View style={styles.handleContainer}>
                        <View style={styles.handle} />
                    </View>

                    {/* Header */}
                    <View style={styles.header}>
                        <Animated.Text style={[styles.title, contentStyle]}>{title}</Animated.Text>

                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeButton}
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                            <Animated.Text style={[styles.closeText, contentStyle]}>
                                ✕
                            </Animated.Text>
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <Animated.View style={[styles.content, contentStyle]}>
                        {scrollable ? (
                            <ScrollView
                                contentContainerStyle={styles.scrollContent}
                                showsVerticalScrollIndicator={false}
                                bounces={false}>
                                {children}
                            </ScrollView>
                        ) : (
                            <View style={styles.scrollContent}>{children}</View>
                        )}
                    </Animated.View>
                </Animated.View>
            </View>
        </Portal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: MODAL_HEIGHT,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        overflow: 'hidden',
    },
    handleContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 12,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#e5e7eb',
        borderRadius: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1f2937',
        flex: 1,
    },
    closeButton: {
        marginLeft: 16,
        borderRadius: 999,
        backgroundColor: '#f3f4f6',
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4b5563',
    },
    content: {
        flex: 1,
        position: 'relative',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 12,
        position: 'relative',
    },
});
