import { TorrentSource } from '~/types/server/scrapers/TorrentSource';
import { torrentSourceToString } from '~/utilities/enumConverter';
import { Text } from '../nativewindui/Text';
import { View } from 'react-native';

export default function SourceBadge({ source }: { source: TorrentSource }) {
    const sourceName = torrentSourceToString(source);

    return (
        <View
            className={`rounded-full px-2 py-1 ${
                source === TorrentSource.X1337
                    ? 'bg-purple-500/20'
                    : source === TorrentSource.YTS
                      ? 'bg-blue-500/20'
                      : 'bg-orange-500/20'
            }`}>
            <Text
                className={`font-medium text-xs ${
                    source === TorrentSource.X1337
                        ? 'text-purple-500'
                        : source === TorrentSource.YTS
                          ? 'text-blue-500'
                          : 'text-orange-500'
                }`}>
                {sourceName}
            </Text>
        </View>
    );
}
