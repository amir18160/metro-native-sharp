import React, { useRef } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, View, Text, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedButton } from '~/components/common/AnimatedButton';
import { FontAwesome } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

interface ScalePressableProps {
    children: React.ReactNode;
    className?: string;
    onPress: () => void;
}

function ScalePressable({ children, onPress, className = '' }: ScalePressableProps) {
    const scale = useRef(new Animated.Value(1)).current;

    function onPressIn() {
        Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
    }
    function onPressOut() {
        Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }).start();
    }

    return (
        <Pressable
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            className={className}>
            <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>
        </Pressable>
    );
}

export default function Dashboard() {
    const router = useRouter();

    return (
        <ScrollView className="flex-1 bg-gray-50 p-4">
            {/* Header */}
            <LinearGradient
                colors={['#7C3AED', '#06B6D4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="mb-4 flex-1 rounded-2xl p-4"
                style={{
                    borderRadius: 12,
                }}>
                <View className="flex-1 flex-row gap-3">
                    <ScalePressable
                        onPress={() => Linking.openURL(process.env.EXPO_PUBLIC_CHANNEL_ADDRESS!)}
                        className="flex-1">
                        <View className="flex-1 rounded-xl bg-white/20 p-3">
                            <Text className="font-bold text-lg text-white">Open Channel</Text>
                        </View>
                    </ScalePressable>

                    <View className="flex-row items-center justify-center">
                        <FontAwesome name="telegram" size={50} color="white" />
                    </View>

                    <ScalePressable
                        onPress={() => Linking.openURL(process.env.EXPO_PUBLIC_BOT_ADDRESS!)}
                        className="flex-1">
                        <View className="flex-1 rounded-xl bg-white/20 p-3">
                            <Text className="font-bold text-lg text-white">Open Bot</Text>
                        </View>
                    </ScalePressable>
                </View>
            </LinearGradient>

            {/* Big action card */}
            <View className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
                <Text className="mb-2 font-semibold text-lg">Quick actions</Text>
                <Text className="mb-3 text-sm text-gray-500">
                    Tap either action to jump straight to the feature. Long-press for more options.
                </Text>

                <View className="flex-row gap-3">
                    <ScalePressable
                        onPress={() => router.push('/(telegram)/SendNotification')}
                        className="flex-1">
                        <View className="items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-teal-400 p-3">
                            {/* keep the AnimatedButton component as the internal button (it likely has press/feedback behavior) */}
                            <AnimatedButton
                                title="Send Notification"
                                onPress={() => router.push('/(telegram)/SendNotification')}
                            />
                        </View>
                    </ScalePressable>

                    <ScalePressable
                        onPress={() => router.push('/(telegram)/ForwardedFiles')}
                        className="flex-1">
                        <View className="items-center justify-center rounded-xl bg-gray-100 p-3">
                            <AnimatedButton
                                title="See Forwarded Files"
                                variant="secondary"
                                onPress={() => router.push('/(telegram)/ForwardedFiles')}
                            />
                        </View>
                    </ScalePressable>
                </View>
            </View>
        </ScrollView>
    );
}
