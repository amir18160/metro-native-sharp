import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Animated, Dimensions, Pressable, View } from 'react-native';
import { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { CustomImage } from '../common/CustomImage';
import { Text } from '../nativewindui/Text';
import SourceBadge from './SourceBadge';
import { useState } from 'react';
import Modal from '../common/Modal';
import { useRouter } from 'expo-router';
import { AbstractedLatestTorrent } from '~/types/server/scrapers/AbstractedLatestTorrent';
import YtsDetailsScreen from '../TorrentSearch/YtsDetailsScreen';
import { TorrentSource } from '~/types/server/scrapers/TorrentSource';
import RarbgDetailsScreen from '../TorrentSearch/RarbgDetailsScreen';
import X1337DetailsScreen from './X1337DetailsScreen';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.55;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface IProps {
    item: AbstractedLatestTorrent;
}

export default function LatestTorrentCard({ item }: IProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();

    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const onSelectMagnet = (magnet: string) => {
        console.log('this magnet');
        console.log(magnet);

        setIsModalOpen(false);

        router.push({
            pathname: '/(tasks)/AddTaskForm',
            params: {
                magnet: magnet,
            },
        });
    };

    const onSelectCard = () => {
        setIsModalOpen(true);
    };

    const renderModalContent = () => {
        if (!item) {
            return <></>;
        }

        if (item.type === TorrentSource.YTS) {
            return <YtsDetailsScreen link={item.detailUrl} onSelect={onSelectMagnet} />;
        }

        if (item.type === TorrentSource.RARBG) {
            return <RarbgDetailsScreen link={item.detailUrl} onSelect={onSelectMagnet} />;
        }

        if (item.type === TorrentSource.X1337) {
            return <X1337DetailsScreen link={item.detailUrl} onSelect={onSelectMagnet} />;
        }

        return <></>;
    };

    return (
        <AnimatedPressable
            className="mr-4"
            style={[animatedStyle, { width: CARD_WIDTH }]}
            onPressIn={() => {
                scale.value = withSpring(0.97);
                opacity.value = withTiming(0.9, { duration: 100 });
            }}
            onPressOut={() => {
                scale.value = withSpring(1);
                opacity.value = withTiming(1, { duration: 200 });
            }}
            onPress={() => onSelectCard()}>
            <View className="overflow-hidden rounded-2xl bg-white shadow-lg shadow-black/10 dark:bg-gray-800 dark:shadow-gray-900/50">
                {/* Image container with fallback */}
                {item.imageUrl ? (
                    <CustomImage
                        source={{ uri: item.imageUrl }}
                        style={{ height: CARD_WIDTH * 0.6, width: '100%' }}
                        resizeMode="cover"
                        fallbackSource={require('~/assets/movie-time.jpg')}
                    />
                ) : (
                    <View className="flex h-32 w-full items-center justify-center bg-gray-100 dark:bg-gray-700">
                        <CustomImage
                            source={require('../../assets/movie-time.jpg')}
                            style={{ height: CARD_WIDTH * 0.6, width: '100%' }}
                            resizeMode="cover"
                        />
                    </View>
                )}

                {/* Content */}
                <View className="p-3">
                    {/* Title */}
                    <Text
                        className="mb-2 font-bold text-base text-gray-900 dark:text-white"
                        numberOfLines={1}>
                        {item.title}
                    </Text>

                    {/* Metadata row */}
                    <View className="mb-2 flex-row justify-between">
                        <View className="flex-row items-center">
                            {item.year && (
                                <Text className="mr-2 text-xs text-gray-600 dark:text-gray-300">
                                    {item.year}
                                </Text>
                            )}

                            {item.size && (
                                <View className="flex-row items-center">
                                    <MaterialCommunityIcons
                                        name="download"
                                        size={12}
                                        className="mr-1 text-gray-500 dark:text-gray-400"
                                    />
                                    <Text className="text-xs text-gray-600 dark:text-gray-300">
                                        {item.size}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {item.rating && (
                            <View className="flex-row items-center">
                                <MaterialCommunityIcons
                                    name="star"
                                    size={12}
                                    fill="gold"
                                    className="mr-1 text-yellow-400"
                                />
                                <Text className="text-xs text-gray-600 dark:text-gray-300">
                                    {item.rating}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Stats row */}
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row">
                            {typeof item.seeders === 'number' && (
                                <View className="mr-3 flex-row items-center">
                                    <MaterialCommunityIcons
                                        name="arrow-up"
                                        size={12}
                                        className="mr-1 text-green-500"
                                    />
                                    <Text className="text-xs text-gray-600 dark:text-gray-300">
                                        {item.seeders}
                                    </Text>
                                </View>
                            )}

                            {typeof item.leechers === 'number' && (
                                <View className="flex-row items-center">
                                    <MaterialCommunityIcons
                                        name="arrow-down"
                                        size={12}
                                        className="mr-1 text-red-500"
                                    />
                                    <Text className="text-xs text-gray-600 dark:text-gray-300">
                                        {item.leechers}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <SourceBadge source={item.type} />
                    </View>

                    {/* Genres */}
                    {item.genres && item.genres.length > 0 && (
                        <View className="mt-2 flex-row flex-wrap">
                            {item.genres.slice(0, 2).map((genre: string, index: number) => (
                                <View
                                    key={index}
                                    className="mb-1 mr-1 rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-700">
                                    <Text className="text-xs text-gray-600 dark:text-gray-300">
                                        {genre}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </View>

            <Modal
                title="Torrent Details"
                onClose={() => setIsModalOpen(false)}
                visible={isModalOpen}>
                {renderModalContent()}
            </Modal>
        </AnimatedPressable>
    );
}
