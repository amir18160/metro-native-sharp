import { ScrollView, View } from 'react-native';

import { Button } from '~/components/TestButton';
import { useRouter } from 'expo-router';

export default function Screen() {
    const router = useRouter();
    return (
        <ScrollView>
            <View className="mx-auto mb-14 flex w-full max-w-[95%] gap-2">
                <Button title="Login" onPress={() => router.push('/(auth)/Login')} />
                <Button title="register" onPress={() => router.push('/(auth)/Register')} />
                <Button title="Logs" onPress={() => router.push('/(drawer)/(admin)/(tabs)/Logs')} />
                <Button
                    title="Account Details"
                    onPress={() => router.push('/(account)/AccountDetailPage')}
                />
                <Button title="Tasks List" onPress={() => router.push('/(tasks)/TaskListPage')} />
                <Button title="Add Task" onPress={() => router.push('/(tasks)/AddTaskForm')} />
                <Button title="SearchMedia" onPress={() => router.push('/(tmdb)/SearchMedia')} />
                <Button title="Indexers" onPress={() => router.push('/(indexer)/Indexers')} />
                <Button
                    title="Indexer Search"
                    onPress={() => router.push('/(indexer)/IndexerSearchTorrent')}
                />
                <Button title="Browser" onPress={() => router.push('/(browser)/Browser')} />
                <Button title="Drawer User" onPress={() => router.push('/(drawer)/(user)/Home')} />
                <Button
                    title="Drawer Admin"
                    onPress={() => router.push('/(drawer)/(admin)/(tabs)/Dashboard')}
                />
                <Button title="Settings" onPress={() => router.push('/(settings)/RootSettings')} />
                <Button
                    title="Torrent Search"
                    onPress={() => router.push('/(torrentSearch)/TorrentSearch')}
                />
                <Button title="File Manager" onPress={() => router.push('/(files)/Files')} />
            </View>
        </ScrollView>
    );
}
