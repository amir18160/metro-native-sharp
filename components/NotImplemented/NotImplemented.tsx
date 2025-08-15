import { useRouter } from 'expo-router';
import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '../nativewindui/Text';

export default function NotImplemented() {
    const router = useRouter();

    return (
        <View className="flex-1 items-center justify-center bg-white px-6">
            <Text className="mb-4 text-center font-semibold text-4xl text-rose-600">
                هنوز پیاده‌سازی نشده!
            </Text>
            <Text className="mb-8 text-center font-medium text-sm text-gray-600">
                این بخش از برنامه در دست توسعه است. لطفاً بعداً دوباره سر بزنید. اگه ادمینی از منوی
                کشویی برو صفحه ادمین.
            </Text>

            <Pressable
                onPress={() => router.back()}
                className="rounded-xl bg-rose-500 px-6 py-3 shadow-lg active:bg-rose-600">
                <Text className="font-semibold text-lg text-white">بازگشت</Text>
            </Pressable>
        </View>
    );
}
