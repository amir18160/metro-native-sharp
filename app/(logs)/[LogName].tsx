import { View, ActivityIndicator, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { useGetLogContent } from '~/hooks/services/logs/useGetLogContent';
import { Text } from '~/components/nativewindui/Text';
import { AntDesign } from '@expo/vector-icons';

export default function LogDetailPage() {
    const { LogName }: { LogName: string } = useLocalSearchParams();
    const scrollViewRef = useRef<ScrollView>(null);
    const log = useGetLogContent({ filename: LogName });

    const scrollToTop = () => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    };

    const scrollToBottom = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    if (log.isPending) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
                <ActivityIndicator size="large" />
                <Text className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                    در حال بارگزاری...
                </Text>
            </View>
        );
    }

    if (log.isError) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Text className="text-lg text-red-500">خطا در دریافت اطلاعات</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            <Stack.Screen options={{ title: LogName }} />

            <ScrollView
                ref={scrollViewRef}
                className="p-4"
                contentContainerStyle={{ paddingBottom: 80 }}>
                <Text
                    selectable
                    className="font-mono text-xs leading-5 text-gray-800 dark:text-gray-200">
                    {log.data}
                </Text>
            </ScrollView>

            {/* Scroll Buttons */}
            <View className="absolute bottom-4 right-4 flex-row space-x-3">
                <TouchableOpacity
                    onPress={scrollToTop}
                    className="rounded-full bg-gray-800 p-3 shadow-lg dark:bg-gray-700"
                    style={styles.buttonShadow}>
                    <AntDesign name="arrowup" size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={scrollToBottom}
                    className="rounded-full bg-gray-800 p-3 shadow-lg dark:bg-gray-700"
                    style={styles.buttonShadow}>
                    <AntDesign name="arrowdown" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});
