import { View, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

import { useGetLogContent } from '~/hooks/services/logs/useGetLogContent';
import { Text } from '~/components/nativewindui/Text';

export default function LogDetailPage() {
  const { LogName }: { LogName: string } = useLocalSearchParams();
  const log = useGetLogContent({ filename: LogName });

  if (log.isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-lg text-gray-600 dark:text-gray-300">در حال بارگزاری...</Text>
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

  // console.log(log.data);

  return (
    <View className="flex-1 bg-gray-50 p-4 dark:bg-black">
      <Stack.Screen options={{ title: LogName }} />
      <ScrollView>
        <Text>{log.data}</Text>
      </ScrollView>
    </View>
  );
}
