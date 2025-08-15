import { View, ScrollView, Pressable, Linking } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import { X1337Details } from '~/types/server/scrapers/x1337-details';
import { Loading } from '../Loading/Loading';
import { Error } from '../Error/Error';
import { Text } from '~/components/nativewindui/Text';
import { CustomImage } from '~/components/common/CustomImage';
import { useTorrentDetails } from '~/hooks/services/scrapers/useTorrentDetails';

interface IProps {
    link: string;
    onSelect: (magnet: string) => void;
}

export default function X1337DetailsScreen({ link, onSelect }: IProps) {
    const torrentDetails = useTorrentDetails({ source: link });

    if (torrentDetails.isLoading) return <Loading />;

    if (torrentDetails.error || !torrentDetails.data?.data)
        return <Error message="Failed to get Torrent Details" />;

    const data = torrentDetails.data.data as X1337Details;

    return (
        <ScrollView className="bg-gray-50 p-4">
            {/* Header */}
            <Animated.View
                entering={FadeInDown.springify()}
                className="flex-row rounded-2xl bg-white p-3 shadow-md">
                <CustomImage
                    source={data?.image ? { uri: data.image } : undefined}
                    fallbackSource={require('~/assets/movie/FallbackSearch.png')}
                    className="h-40 w-28 rounded-xl"
                    resizeMode="cover"
                />
                <View className="ml-4 flex-1 justify-between">
                    <Text className="font-bold text-lg text-gray-900" numberOfLines={2}>
                        {data?.name}
                    </Text>

                    <Text className="mt-1 text-sm text-gray-600">Size: {data?.size}</Text>

                    <View className="mt-2 flex-row">
                        <Ionicons name="arrow-up" size={14} color="#16a34a" />
                        <Text className="ml-1 text-sm text-gray-800">{data.seeds} Seeds</Text>
                        <Ionicons
                            name="arrow-down"
                            size={14}
                            color="#dc2626"
                            style={{ marginLeft: 10 }}
                        />
                        <Text className="ml-1 text-sm text-gray-800">{data.leeches} Leeches</Text>
                    </View>

                    {data?.imdbRef ? (
                        <Pressable
                            className="mt-3 flex-row items-center"
                            onPress={() =>
                                Linking.openURL(`https://www.imdb.com/title/${data.imdbRef}`)
                            }>
                            <FontAwesome name="imdb" size={24} color="#facc15" />
                            <Text className="ml-2 text-sm text-indigo-600">View on IMDb</Text>
                        </Pressable>
                    ) : null}
                </View>
            </Animated.View>

            {/* Torrent Magnet */}
            <Animated.View
                entering={FadeInUp.delay(300).springify()}
                className="mt-4 rounded-xl bg-white p-4 shadow-sm">
                <Text className="mb-3 font-bold text-lg text-gray-900">Download</Text>

                {data?.magnet ? (
                    <Pressable
                        onPress={() => onSelect(data.magnet)}
                        android_ripple={{ color: 'rgba(255,255,255,0.08)' }}
                        className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
                        <View className="flex-row items-center justify-between px-4 py-3">
                            <Text className="font-semibold text-gray-900">Magnet Link</Text>
                            <View className="flex-row items-center rounded-lg bg-indigo-500 px-3 py-2">
                                <Ionicons name="magnet" size={16} color="#fff" />
                                <Text className="ml-2 font-medium text-white">Get Magnet</Text>
                            </View>
                        </View>
                    </Pressable>
                ) : (
                    <Text className="text-sm text-gray-500">No magnet link available</Text>
                )}
            </Animated.View>
        </ScrollView>
    );
}
