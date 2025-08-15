import React, { useState } from 'react';
import { View, ScrollView, Pressable, Linking } from 'react-native';
import Animated, { FadeInUp, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

import { RarbgDetails } from '~/types/server/scrapers/rarbg-details';
import { Loading } from '../Loading/Loading';
import { Error } from '../Error/Error';
import { Text } from '~/components/nativewindui/Text';
import { CustomImage } from '~/components/common/CustomImage';
import { useTorrentDetails } from '~/hooks/services/scrapers/useTorrentDetails';

interface IProps {
    link: string;
    onSelect: (magnet: string) => void;
}

export default function RarbgDetailsScreen({ link, onSelect }: IProps) {
    const torrentDetails = useTorrentDetails({ source: link });
    const [expanded, setExpanded] = useState(false);

    if (torrentDetails.isLoading) return <Loading />;

    if (torrentDetails.error || !torrentDetails.data?.data)
        return <Error message="Failed to get Torrent Details" />;

    const data = torrentDetails.data.data as RarbgDetails;

    return (
        <ScrollView className="bg-gray-50 p-4">
            {/* Header */}
            <Animated.View
                entering={FadeInDown.springify()}
                className="flex-row rounded-2xl bg-white p-3 shadow-md">
                <CustomImage
                    source={data?.thumbnail ? { uri: data.thumbnail } : undefined}
                    fallbackSource={require('~/assets/movie/FallbackSearch.png')}
                    className="h-40 w-28 rounded-xl"
                    resizeMode="cover"
                />
                <View className="ml-4 flex-1 justify-between">
                    <Text className="font-bold text-lg text-gray-900" numberOfLines={2}>
                        {data?.torrent}
                    </Text>

                    {data?.genre?.length ? (
                        <Text className="mt-1 text-sm text-gray-600">{data.genre.join(', ')}</Text>
                    ) : null}

                    {data?.size ? (
                        <View className="mt-2 flex-row items-center">
                            <MaterialIcons name="storage" size={16} color="#6b7280" />
                            <Text className="ml-1 text-sm text-gray-800">{data.size}</Text>
                        </View>
                    ) : null}

                    {data?.imdb.link ? (
                        <Pressable
                            className="mt-3 flex-row items-center"
                            onPress={() => Linking.openURL(data.imdb.link)}>
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

            {/* Torrent Info */}
            <Animated.View
                entering={FadeInUp.delay(300).springify()}
                className="mt-4 rounded-xl bg-white p-4 shadow-sm">
                <Text className="mb-3 font-bold text-lg text-gray-900">Torrent Info</Text>

                <View className="space-y-2">
                    <Text className="text-sm text-gray-700">Uploader: {data.uploader}</Text>
                    <Text className="text-sm text-gray-700">Added: {data.added}</Text>
                    <Text className="text-sm text-gray-700">Category: {data.category}</Text>
                    <Text className="text-sm text-gray-700">Language: {data.language}</Text>
                    <Text className="text-sm text-gray-700">Downloads: {data.downloads}</Text>
                    <Text className="text-sm text-gray-700">
                        Peers: {data.peers.seeders} seeders / {data.peers.leechers} leechers
                    </Text>
                </View>
            </Animated.View>

            {/* Magnet Button */}
            {data?.magnetLink ? (
                <Animated.View
                    entering={FadeInUp.delay(450).springify()}
                    className="mt-4 rounded-xl bg-indigo-500 p-4 shadow-sm">
                    <Pressable
                        onPress={() => onSelect(data.magnetLink)}
                        android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
                        className="flex-row items-center justify-center">
                        <Ionicons name="magnet" size={18} color="#fff" />
                        <Text className="ml-2 font-semibold text-white">Download Magnet</Text>
                    </Pressable>
                </Animated.View>
            ) : null}
        </ScrollView>
    );
}
