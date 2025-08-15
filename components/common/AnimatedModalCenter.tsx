import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { Portal } from '@gorhom/portal';
import { useAnimatedModalCenterStore } from '~/stores/useAnimatedModalCenterStore';
import { ModalVariants } from '~/types/common/ModalType';

import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const AnimatedModalCenter: React.FC = () => {
    const {
        visible,
        variant,
        title,
        message,
        confirmText,
        cancelText,
        onConfirm,
        onCancel,
        hideModal,
        additionalJSX,
        loadingSource,
    } = useAnimatedModalCenterStore();

    const backdropOpacity = useSharedValue(0);
    const modalScale = useSharedValue(0.8);
    const modalOpacity = useSharedValue(0);

    const backdropAnimatedStyle = useAnimatedStyle(() => ({
        opacity: backdropOpacity.value,
    }));

    const modalAnimatedStyle = useAnimatedStyle(() => ({
        opacity: modalOpacity.value,
        transform: [{ scale: modalScale.value }],
    }));

    // Animate modal open/close
    useEffect(() => {
        const springConfig = { damping: 15, stiffness: 120 };
        const timingConfig = { duration: 300, easing: Easing.inOut(Easing.ease) };

        if (visible) {
            backdropOpacity.value = withTiming(1, timingConfig);
            modalOpacity.value = withTiming(1, timingConfig);
            modalScale.value = withSpring(1, springConfig);
        } else {
            backdropOpacity.value = withTiming(0, timingConfig);
            modalOpacity.value = withTiming(0, timingConfig);
            modalScale.value = withTiming(0.9, timingConfig);
        }
    }, [visible]);

    // Bind loading source if provided
    useEffect(() => {
        if (loadingSource) {
            const cleanup = useAnimatedModalCenterStore.getState().bindLoading(loadingSource);
            return cleanup;
        }
    }, [loadingSource]);

    const handleConfirm = () => {
        onConfirm?.();
        hideModal();
    };

    const handleCancel = () => {
        onCancel?.();
        hideModal();
    };

    const renderContent = () => {
        switch (variant) {
            case ModalVariants.LOADING:
                return (
                    <View className="w-full items-center py-6">
                        <ActivityIndicator size="large" color="#6366f1" />
                        <Text className="mt-6 text-center text-base text-gray-600">{message}</Text>
                    </View>
                );

            case ModalVariants.CONFIRMATION:
                return (
                    <View className="items-center">
                        <Text className="mb-3 font-bold text-xl text-gray-800">{title}</Text>
                        <Text className="mb-8 text-center text-base text-gray-600">{message}</Text>
                        {additionalJSX}
                        <View className="w-full flex-row justify-between gap-4">
                            <TouchableOpacity
                                className="flex-1 items-center rounded-xl bg-gray-100 py-4"
                                onPress={handleCancel}>
                                <Text className="font-semibold text-base text-gray-600">
                                    {cancelText}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 items-center rounded-xl bg-indigo-500 py-4"
                                onPress={handleConfirm}>
                                <Text className="font-semibold text-base text-white">
                                    {confirmText}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );

            case ModalVariants.INFORMATION:
                return (
                    <View className="items-center">
                        <Ionicons name="information-circle" size={48} color="#3b82f6" />
                        <Text className="mt-4 font-bold text-xl text-gray-800">{title}</Text>
                        <Text className="mb-6 mt-2 text-center text-base text-gray-600">
                            {message}
                        </Text>
                        {additionalJSX}
                        <TouchableOpacity
                            className="rounded-xl bg-blue-500 px-6 py-3"
                            onPress={hideModal}>
                            <Text className="font-semibold text-white">OK</Text>
                        </TouchableOpacity>
                    </View>
                );

            case ModalVariants.ERROR:
                return (
                    <View className="items-center">
                        <MaterialIcons name="cancel" size={48} color="#ef4444" />
                        <Text className="mt-4 font-bold text-xl text-gray-800">{title}</Text>
                        <Text className="mb-6 mt-2 text-center text-base text-gray-600">
                            {message}
                        </Text>
                        {additionalJSX}
                        <TouchableOpacity
                            className="rounded-xl bg-red-500 px-6 py-3"
                            onPress={hideModal}>
                            <Text className="font-semibold text-white">Close</Text>
                        </TouchableOpacity>
                    </View>
                );

            case ModalVariants.SUCCESS:
                return (
                    <View className="items-center">
                        <AntDesign name="checkcircleo" size={48} color="#10b981" />
                        <Text className="mt-4 font-bold text-xl text-gray-800">{title}</Text>
                        <Text className="mb-6 mt-2 text-center text-base text-gray-600">
                            {message}
                        </Text>
                        {additionalJSX}
                        <TouchableOpacity
                            className="rounded-xl bg-green-500 px-6 py-3"
                            onPress={hideModal}>
                            <Text className="font-semibold text-white">Great!</Text>
                        </TouchableOpacity>
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <Portal>
            {visible && (
                <View className="absolute inset-0" pointerEvents="box-none">
                    <Animated.View
                        className="absolute inset-0 bg-black/60"
                        style={backdropAnimatedStyle}
                    />
                    <TouchableOpacity
                        className="absolute inset-0"
                        activeOpacity={1}
                        onPress={variant === ModalVariants.CONFIRMATION ? handleCancel : undefined}
                    />
                    <View
                        className="z-[9999] flex-1 items-center justify-center"
                        pointerEvents="box-none">
                        <Animated.View
                            className="w-4/5 max-w-[400px] rounded-3xl bg-white p-6 shadow-lg"
                            style={modalAnimatedStyle}>
                            {renderContent()}
                        </Animated.View>
                    </View>
                </View>
            )}
        </Portal>
    );
};

export default AnimatedModalCenter;
