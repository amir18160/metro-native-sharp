import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Button } from '~/components/TestButton';

export default function RootSettings() {
    const router = useRouter();

    return (
        <View>
            <Button
                title="Browser"
                onPress={() => router.push('/(settings)/DownloadManagerSettings')}
            />
        </View>
    );
}
