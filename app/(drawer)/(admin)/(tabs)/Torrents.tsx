import { ScrollView, View } from 'react-native';
import LatestTorrentsList from '~/components/Torrents/LatestTorrentsList';
import YtsMovieGrid from '~/components/Torrents/YtsMovieGrid';

export default function Torrents() {
    return (
        <ScrollView>
            <View className="my-10 flex-1">
                <LatestTorrentsList />
                <View className="mt-5 flex-1">
                    <YtsMovieGrid />
                </View>
            </View>
        </ScrollView>
    );
}
