import { ScrollView, Pressable } from 'react-native';
import { useGetLogsList } from '~/hooks/services/logs/useGetLogsList';
import { Text } from '~/components/nativewindui/Text';
import { Link } from 'expo-router';

export default function LogListPage() {
  const logs = useGetLogsList();

  if (logs.isLoading) {
    return <Text className="font-semibold">در حال بارگذاری...</Text>;
  }
  if (logs.isError) {
    return <Text className="font-semibold">دریافت ناموفق</Text>;
  }

  return (
    <ScrollView>
      <Text>This is list of logs</Text>

      {logs?.data &&
        logs.data.map((log) => (
          <Link
            key={log}
            href={{ pathname: '/(drawer)/(admin)/Logs/[LogName]', params: { LogName: log } }}
            asChild>
            <Pressable>
              <Text variant="title2">{log}</Text>
            </Pressable>
          </Link>
        ))}
    </ScrollView>
  );
}
