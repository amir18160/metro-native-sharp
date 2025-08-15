import { FlatList, Pressable, ActivityIndicator, View } from 'react-native';
import { useGetLogsList } from '~/hooks/services/logs/useGetLogsList';
import { Text } from '~/components/nativewindui/Text';
import { Link } from 'expo-router';
import { format } from 'date-fns';

export default function LogListPage() {
    const logs = useGetLogsList();

    // Function to format log filenames into readable dates
    const formatLogName = (logName: string) => {
        try {
            // Extract date from filename (log-YYYYMMDD.txt)
            const dateString = logName.replace('log-', '').replace('.txt', '');
            const year = dateString.slice(0, 4);
            const month = dateString.slice(4, 6);
            const day = dateString.slice(6, 8);

            // Format using Persian locale
            return format(
                new Date(parseInt(year), parseInt(month) - 1, parseInt(day)),
                'EEEE, d MMMM yyyy'
            );
        } catch {
            return logName;
        }
    };

    if (logs.isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
                <ActivityIndicator size="large" />
                <Text className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                    در حال بارگذاری گزارشات...
                </Text>
            </View>
        );
    }

    if (logs.isError) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Text className="text-lg text-red-500 dark:text-red-400">
                    خطا در دریافت گزارشات
                </Text>
                <Text className="mt-2 text-gray-500 dark:text-gray-400">
                    لطفاً اتصال شبکه را بررسی کنید
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50 p-4 dark:bg-gray-900">
            <Text variant="title1" className="mb-4 text-center text-gray-800 dark:text-white">
                گزارشات سیستم
            </Text>

            <FlatList
                data={logs.data}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View className="items-center py-10">
                        <Text className="text-gray-500 dark:text-gray-400">گزارشی یافت نشد</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <Link
                        href={{
                            pathname: '/(logs)/[LogName]',
                            params: { LogName: item },
                        }}
                        asChild>
                        <Pressable className="mb-3">
                            {({ pressed }) => (
                                <View
                                    className={`
                    rounded-xl border border-gray-200
                    p-5 shadow-sm dark:border-gray-700
                    ${pressed ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-800'}
                  `}
                                    style={{
                                        transform: pressed ? [{ scale: 0.98 }] : [],
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.05,
                                        shadowRadius: 3,
                                        elevation: 2,
                                    }}>
                                    <View className="flex-row items-center">
                                        <View className="mr-3 rounded-lg bg-blue-100 p-3 dark:bg-blue-900/40">
                                            <Text className="text-blue-600 dark:text-blue-400">
                                                📝
                                            </Text>
                                        </View>

                                        <View className="flex-1">
                                            <Text
                                                variant="title3"
                                                className="mb-1 text-gray-800 dark:text-gray-100">
                                                گزارش سیستم
                                            </Text>
                                            <Text className="text-gray-500 dark:text-gray-400">
                                                {formatLogName(item)}
                                            </Text>
                                        </View>

                                        <Text className="text-gray-400 dark:text-gray-500">→</Text>
                                    </View>
                                </View>
                            )}
                        </Pressable>
                    </Link>
                )}
            />
        </View>
    );
}
