import React, { useMemo } from 'react';
import { View, Dimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { Error } from '../Error/Error';
import { NoData } from '../NoData/NoData';
import { Text } from '../nativewindui/Text';
import { useLatestMovies } from '~/hooks/services/scrapers/useLatestMovies';
import { TorrentSource } from '~/types/server/scrapers/TorrentSource';
import { torrentSourceToString } from '~/utilities/enumConverter';
import LatestTorrentCard from './LatestTorrentCardItem';
import { AbstractedLatestTorrent } from '~/types/server/scrapers/AbstractedLatestTorrent';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.55;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

// Skeleton Loading Components
const TorrentCardSkeleton = () => (
    <Animated.View
        entering={FadeIn.delay(100).duration(300)}
        layout={LinearTransition.springify()}
        className="mr-4 overflow-hidden rounded-2xl bg-gray-200 shadow-lg dark:bg-gray-700"
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
        {/* Image placeholder */}
        <View className="h-32 w-full bg-gray-300 dark:bg-gray-600" />

        {/* Content placeholder */}
        <View className="p-3">
            {/* Title */}
            <View className="mb-3 h-5 w-3/4 rounded bg-gray-300 dark:bg-gray-600" />

            {/* Metadata row */}
            <View className="mb-3 flex-row justify-between">
                <View className="h-4 w-16 rounded bg-gray-300 dark:bg-gray-600" />
                <View className="h-4 w-10 rounded bg-gray-300 dark:bg-gray-600" />
            </View>

            {/* Stats row */}
            <View className="flex-row justify-between">
                <View className="flex-row space-x-3">
                    <View className="h-4 w-10 rounded bg-gray-300 dark:bg-gray-600" />
                    <View className="h-4 w-10 rounded bg-gray-300 dark:bg-gray-600" />
                </View>
                <View className="h-4 w-16 rounded bg-gray-300 dark:bg-gray-600" />
            </View>

            {/* Genres */}
            <View className="mt-4 flex-row flex-wrap">
                <View className="mb-2 mr-2 h-6 w-16 rounded-full bg-gray-300 dark:bg-gray-600" />
                <View className="mb-2 mr-2 h-6 w-16 rounded-full bg-gray-300 dark:bg-gray-600" />
            </View>
        </View>
    </Animated.View>
);

export default function LatestTorrentsList() {
    const popularTorrentsList = useLatestMovies();

    const data = useMemo(
        () => popularTorrentsList.data?.data ?? [],
        [popularTorrentsList.data?.data]
    );

    const sourceKeys = useMemo(() => {
        return Array.from(
            new Set(data.map((d: AbstractedLatestTorrent) => String(d.type ?? 'unknown')))
        );
    }, [data]);

    const groups = useMemo(() => {
        const map: Record<string, AbstractedLatestTorrent[]> = {};
        data.forEach((item: AbstractedLatestTorrent) => {
            const key = String(item.type ?? 'unknown');
            if (!map[key]) map[key] = [];
            map[key].push(item);
        });
        return map;
    }, [data]);

    if (popularTorrentsList.isError) {
        return <Error message={'Something went wrong'} />;
    }

    if (popularTorrentsList.isLoading) {
        return (
            <View className="my-5">
                <Text className="mb-3 px-4 font-bold text-xl text-gray-900 dark:text-white">
                    Latest Torrents
                </Text>

                <FlatList
                    horizontal
                    data={[...Array(4).keys()]} // 4 skeleton items
                    renderItem={() => <TorrentCardSkeleton />}
                    keyExtractor={(_, index) => `skeleton-${index}`}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    snapToInterval={CARD_WIDTH + 16}
                    decelerationRate="fast"
                />
            </View>
        );
    }

    // No data at all
    if (!data || data.length === 0) {
        return <NoData />;
    }

    return (
        <View className="my-5">
            <Text className="mb-3 px-4 font-bold text-xl text-gray-900 dark:text-white">
                Latest Torrents
            </Text>

            {/* For each source create a header + horizontal FlatList */}
            <View>
                {sourceKeys.map((sourceKey) => {
                    const itemsForSource = groups[sourceKey] ?? [];
                    // Convert back to TorrentSource typed value if possible for the badge/label function
                    // If your enum is numeric, you might need to parseInt(sourceKey) here.
                    const sourceValue: any = (() => {
                        // try numeric
                        const n = Number(sourceKey);
                        if (!Number.isNaN(n) && (Object.values(TorrentSource) as any).includes(n)) {
                            return n;
                        }
                        // otherwise just return original string (torrentSourceToString should handle it if implemented)
                        return sourceKey;
                    })();

                    if (itemsForSource.length === 0) return null;

                    return (
                        <View key={sourceKey} className="mb-6">
                            <View className="mb-2 flex-row items-center justify-between px-4">
                                <Text className="font-semibold text-lg text-gray-900 dark:text-white">
                                    {torrentSourceToString(sourceValue)}
                                </Text>
                                <Text className="text-sm text-gray-500 dark:text-gray-400">
                                    {itemsForSource.length} items
                                </Text>
                            </View>

                            <FlatList
                                horizontal
                                data={itemsForSource}
                                renderItem={({ item }) => <LatestTorrentCard item={item} />}
                                keyExtractor={(item, index) =>
                                    item.detailUrl
                                        ? String(item.detailUrl)
                                        : `${sourceKey}-${index}`
                                }
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 16 }}
                                snapToInterval={CARD_WIDTH + 16}
                                decelerationRate="fast"
                            />
                        </View>
                    );
                })}
            </View>
        </View>
    );
}
