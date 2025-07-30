import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function LogDetailPage() {
  const { LogName } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Log Detail</Text>
      <Text>Viewing details for Log ID: {LogName}</Text>
    </View>
  );
}
