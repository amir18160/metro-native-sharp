import React, { useState } from 'react';
import { View, ScrollView, Pressable, Linking } from 'react-native';
import Animated, { FadeInUp, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

import { YtsDetails } from '~/types/server/scrapers/yts-details';
import { useTorrentDetails } from '~/hooks/services/scrapers/useTorrentDetails';
import { Loading } from '../Loading/Loading';
import { Error } from '../Error/Error';
import { Text } from '~/components/nativewindui/Text';
import { CustomImage } from '~/components/common/CustomImage';

interface IProps {
    link: string;
    onSelect: (magnet: string) => void;
}

export default function YtsDetailsScreen({ link, onSelect }: IProps) {
    const torrentDetails = useTorrentDetails({ source: link });
    const [expanded, setExpanded] = useState(false);

    if (torrentDetails.isLoading) return <Loading />;

    if (torrentDetails.error || !torrentDetails.data?.data)
        return <Error message="Failed to get Torrent Details" />;

    const data = torrentDetails.data.data as YtsDetails;

    return (
        <ScrollView className="bg-gray-50 p-4">
            {/* Header */}
            <Animated.View
                entering={FadeInDown.springify()}
                className="flex-row rounded-2xl bg-white p-3 shadow-md">
                <CustomImage
                    source={data?.imageUrl ? { uri: data.imageUrl } : undefined}
                    fallbackSource={require('~/assets/movie/FallbackSearch.png')}
                    className="h-40 w-28 rounded-xl"
                    resizeMode="cover"
                />
                <View className="ml-4 flex-1 justify-between">
                    <Text className="font-bold text-lg text-gray-900" numberOfLines={2}>
                        {data?.title} {data?.year ? `(${data?.year})` : ''}
                    </Text>

                    {data?.genres?.length ? (
                        <Text className="mt-1 text-sm text-gray-600">{data.genres.join(', ')}</Text>
                    ) : null}

                    {data?.imdbRating ? (
                        <View className="mt-2 flex-row items-center">
                            <Ionicons name="star" size={16} color="#facc15" />
                            <Text className="ml-1 text-sm text-gray-800">{data.imdbRating}/10</Text>
                        </View>
                    ) : null}

                    {data?.imdbUrl ? (
                        <Pressable
                            className="mt-3 flex-row items-center"
                            onPress={() => Linking.openURL(data.imdbUrl)}>
                            <FontAwesome name="imdb" size={24} color="#facc15" />
                            <Text className="ml-2 text-sm text-indigo-600">View on IMDb</Text>
                        </Pressable>
                    ) : null}
                </View>
            </Animated.View>

            {/* Description */}
            {data?.description ? (
                <Animated.View
                    entering={FadeInUp.delay(150).springify()}
                    layout={LinearTransition.springify()}
                    className="mt-4 rounded-xl bg-white p-4 shadow-sm">
                    <Pressable onPress={() => setExpanded((p) => !p)}>
                        <Text
                            className="text-sm leading-5 text-gray-700"
                            numberOfLines={expanded ? undefined : 4}>
                            {data.description}
                        </Text>
                        <Text className="mt-2 text-indigo-500">
                            {expanded ? 'Show Less' : 'Read More'}
                        </Text>
                    </Pressable>
                </Animated.View>
            ) : null}

            {/* Torrents */}
            {data?.availableTorrents?.length ? (
                <Animated.View
                    entering={FadeInUp.delay(300).springify()}
                    className="mt-4 rounded-xl bg-white p-4 shadow-sm">
                    <Text className="mb-3 font-bold text-lg text-gray-900">Available Torrents</Text>

                    {data.availableTorrents.map((torrent, index) => {
                        return (
                            <Animated.View
                                key={`${torrent?.quality ?? 'q'}-${torrent?.size ?? index}-${index}`}
                                entering={FadeInUp.delay(index * 90).springify()}
                                layout={LinearTransition.springify()}>
                                <Pressable
                                    onPress={() => {
                                        onSelect(torrent.magnetLink);
                                    }}
                                    android_ripple={{ color: 'rgba(255,255,255,0.08)' }}
                                    className="mb-3 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
                                    <View className="flex-row items-stretch">
                                        {/* Left: info */}
                                        <View className="flex-1 justify-center px-4">
                                            <Text className="font-semibold text-gray-900">
                                                {torrent?.quality}
                                            </Text>
                                            <Text className="text-sm text-gray-600">
                                                {(torrent?.size || 0) + ' GB'}
                                            </Text>
                                        </View>

                                        {/* Right: magnet area (half width, full height). Reduced icon/label size */}
                                        {torrent?.magnetLink ? (
                                            <View className="w-1/2 items-center justify-center bg-indigo-500 p-2">
                                                <Ionicons name="magnet" size={14} color="#fff" />
                                                <Text className="mt-1 font-medium text-[11px] text-white">
                                                    Magnet
                                                </Text>
                                            </View>
                                        ) : (
                                            <View className="w-1/2 items-center justify-center bg-gray-100 p-2">
                                                <Text className="text-xs text-gray-500">
                                                    No Magnet
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </Pressable>
                            </Animated.View>
                        );
                    })}
                </Animated.View>
            ) : null}
        </ScrollView>
    );
}
