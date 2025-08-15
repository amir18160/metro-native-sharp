// app/(drawer)/user/home.tsx
import { Text, View } from 'react-native';
import SystemInfoDisplay from '~/components/Dashboard/SystemResources';

export default function Dashboard() {
    return (
        <View className="flex-1 items-center justify-center">
            <SystemInfoDisplay />
        </View>
    );
}
