import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, FlatList, Dimensions, Pressable } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { IYtsSearchParams } from '~/services/remote/scraperService';
import { useAllYtsMovies } from '~/hooks/services/scrapers/useAllYtsMovies';
import { Text } from '../nativewindui/Text';
import { CustomImage } from '../common/CustomImage';
import { YtsPreview } from '~/types/server/scrapers/yts-preview';
import Modal from '../common/Modal';
import YtsDetailsScreen from '../TorrentSearch/YtsDetailsScreen';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Tweak these to change card sizing
const HORIZONTAL_PADDING = 32;
const ITEM_SPACING = 12;
const CARD_WIDTH = Math.floor((width - HORIZONTAL_PADDING) * 0.4);
const POSTER_HEIGHT = 140;
const CARD_HORIZONTAL_PADDING = 8;

// Skeleton loading component
const MovieCardSkeleton = ({ index }: { index: number }) => (
    <Animated.View
        entering={FadeInDown.delay((index % 10) * 30).duration(220)}
        style={{ width: CARD_WIDTH, marginRight: ITEM_SPACING }}>
        <View className="overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-700">
            <View style={{ height: POSTER_HEIGHT }} className="bg-gray-300 dark:bg-gray-600" />
            <View style={{ padding: CARD_HORIZONTAL_PADDING }}>
                <View className="flex-row items-start justify-between">
                    <View className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-600" />
                    <View className="ml-2 h-3 w-1/4 rounded bg-gray-300 dark:bg-gray-600" />
                </View>
                <View className="mt-2 h-3 w-1/2 rounded bg-gray-300 dark:bg-gray-600" />
            </View>
        </View>
    </Animated.View>
);

const HorizontalListSkeleton = ({ listIndex }: { listIndex: number }) => (
    <View style={{ marginBottom: 18 }}>
        <View className="mb-2 flex-row items-center justify-between px-4">
            <View className="h-5 w-20 rounded bg-gray-300 dark:bg-gray-600" />
            <View className="flex-row items-center">
                <View className="mr-2 h-8 w-16 rounded-full bg-gray-300 dark:bg-gray-600" />
                <View className="h-8 w-16 rounded-full bg-gray-300 dark:bg-gray-600" />
            </View>
        </View>

        <FlatList
            data={[...Array(5).keys()]}
            renderItem={({ index }) => <MovieCardSkeleton index={index} />}
            keyExtractor={(_, i) => `skeleton-${i}`}
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: HORIZONTAL_PADDING / 2 }}
        />
    </View>
);

export default function YtsMovieGrid() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<YtsPreview | null>(null);

    const [searchParams, setSearchParams] = useState<IYtsSearchParams>({
        Genre: '',
        SortBy: 'year',
        Page: 1,
    });

    const router = useRouter();

    const moviesQuery = useAllYtsMovies(searchParams, true);

    // Memoize movies array to prevent unnecessary recalculations
    const movies = useMemo(() => moviesQuery.data?.data ?? [], [moviesQuery.data?.data]);

    // split logic: if less than 10 items, keep a single list; otherwise split into two arrays
    const lists = useMemo(() => {
        if (movies.length < 10) return [movies];
        const half = Math.ceil(movies.length / 2);
        return [movies.slice(0, half), movies.slice(half)];
    }, [movies]);

    // Use proper array type syntax
    const listRefs = useRef<(FlatList<any> | null)[]>([]);

    // function to scroll to start/end for given list index
    const scrollToStart = useCallback((listIndex: number) => {
        const ref = listRefs.current[listIndex];
        if (!ref) return;
        try {
            ref.scrollToOffset({ offset: 0, animated: true });
        } catch {
            ref.scrollToIndex({ index: 0, animated: true });
        }
    }, []);

    const scrollToEnd = useCallback(
        (listIndex: number) => {
            const ref = listRefs.current[listIndex];
            const data = lists[listIndex] ?? [];
            if (!ref || data.length === 0) return;
            const lastIndex = data.length - 1;
            try {
                const offset = lastIndex * (CARD_WIDTH + ITEM_SPACING);
                ref.scrollToOffset({ offset, animated: true });
            } catch {
                ref.scrollToIndex({ index: lastIndex, animated: true });
            }
        },
        [lists]
    );

    // server-side page controls
    const goToPage = (page: number) => {
        setSearchParams((prev) => ({ ...prev, Page: page }));
    };

    const nextPage = () => {
        if (moviesQuery.data?.data) goToPage(searchParams.Page + 1);
    };

    const prevPage = () => {
        if (searchParams.Page > 1) goToPage(searchParams.Page - 1);
    };

    // Filter handlers
    const toggleSortBy = useCallback(() => {
        setSearchParams((prev) => ({
            ...prev,
            SortBy: prev.SortBy === 'year' ? 'popularity' : 'year',
            Page: 1,
        }));
    }, []);

    // Genre cycling handler
    const cycleGenre = useCallback(() => {
        const genres = ['', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'];
        const currentIndex = genres.indexOf(searchParams.Genre);
        const nextIndex = (currentIndex + 1) % genres.length;

        setSearchParams((prev) => ({
            ...prev,
            Genre: genres[nextIndex],
            Page: 1,
        }));
    }, [searchParams.Genre]);

    const onSelectItem = (item: YtsPreview) => {
        if (!item.detailUrl) {
            return;
        }

        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const onSelectMagnet = (magnet: string) => {
        setSelectedItem(null);
        setIsModalOpen(false);

        router.push({
            pathname: '/AddTaskForm',
            params: {
                magnet: magnet,
            },
        });
    };

    // renderer for each movie card
    const renderCard = useCallback(({ item, index }: { item: any; index: number }) => {
        return (
            <Animated.View
                entering={FadeInDown.delay((index % 10) * 30).duration(220)}
                layout={LinearTransition.springify()}
                style={{ width: CARD_WIDTH, marginRight: ITEM_SPACING }}>
                <Pressable onPress={() => onSelectItem(item)}>
                    <View className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-800">
                        {item.imageUrl ? (
                            <CustomImage
                                source={{ uri: item.imageUrl }}
                                style={{ width: '100%', height: POSTER_HEIGHT }}
                                resizeMode="cover"
                                fallbackSource={require('../../assets/movie-time.jpg')}
                            />
                        ) : (
                            <CustomImage
                                source={require('../../assets/movie-time.jpg')}
                                style={{ width: '100%', height: POSTER_HEIGHT }}
                                resizeMode="cover"
                            />
                        )}

                        <View style={{ padding: CARD_HORIZONTAL_PADDING }}>
                            <View className="flex-row items-start justify-between">
                                <Text
                                    className="flex-1 font-semibold text-sm text-gray-900 dark:text-white"
                                    numberOfLines={1}>
                                    {item.title}
                                </Text>
                                {item.year && (
                                    <Text className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                        {item.year}
                                    </Text>
                                )}
                            </View>

                            {item.rating && (
                                <View className="mt-1 flex-row items-center">
                                    <AntDesign name="star" size={12} color="gold" />
                                    <Text className="ml-1 text-xs text-gray-600 dark:text-gray-300">
                                        {item.rating}/10
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </Pressable>
            </Animated.View>
        );
    }, []);

    // getItemLayout for stable scroll offsets
    const getItemLayout = useCallback((_data: any, index: number) => {
        const length = CARD_WIDTH + ITEM_SPACING;
        return { length, offset: length * index, index };
    }, []);

    // wrapper render per horizontal list
    const renderHorizontalList = useCallback(
        ({ item: listData, index: listIndex }: { item: any[]; index: number }) => {
            return (
                <View style={{ marginBottom: 18 }}>
                    <View className="mb-2 flex-row items-center justify-between px-4">
                        <Text className="font-semibold text-base text-gray-900 dark:text-white">
                            List {listIndex + 1}
                        </Text>

                        <View className="flex-row items-center">
                            <Pressable
                                onPress={() => scrollToStart(listIndex)}
                                className="mr-2 rounded-full bg-gray-200 px-3 py-2 dark:bg-gray-700">
                                <Text className="text-sm">Start</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => scrollToEnd(listIndex)}
                                className="rounded-full bg-gray-200 px-3 py-2 dark:bg-gray-700">
                                <Text className="text-sm">End</Text>
                            </Pressable>
                        </View>
                    </View>

                    <FlatList
                        ref={(r) => {
                            listRefs.current[listIndex] = r;
                        }}
                        data={listData}
                        renderItem={renderCard}
                        keyExtractor={(it, i) => it.detailUrl ?? `${it.title}_${i}`}
                        horizontal
                        nestedScrollEnabled
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: HORIZONTAL_PADDING / 2 }}
                        getItemLayout={getItemLayout}
                    />
                </View>
            );
        },
        [getItemLayout, renderCard, scrollToEnd, scrollToStart]
    );

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <View className="flex-row items-center justify-between p-4">
                <Text className="font-bold text-xl text-gray-900 dark:text-white">YTS Movies</Text>

                <View className="flex-row items-center">
                    <Pressable onPress={toggleSortBy} className="mr-2">
                        <Text className="text-sm text-gray-600 dark:text-gray-300">
                            {searchParams.SortBy === 'year' ? 'Year' : 'Popularity'}
                        </Text>
                    </Pressable>
                    <Pressable onPress={cycleGenre}>
                        <Text className="text-sm text-gray-600 dark:text-gray-300">
                            {searchParams.Genre || 'All'}
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/* Loading state with skeleton */}
            {moviesQuery.isLoading && (
                <FlatList
                    data={[0, 1]} // Two skeleton lists
                    renderItem={({ index }) => <HorizontalListSkeleton listIndex={index} />}
                    keyExtractor={(_, i) => `skeleton-list-${i}`}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                    contentContainerStyle={{ paddingBottom: 120 }}
                />
            )}

            {/* Empty state */}
            {movies.length === 0 && !moviesQuery.isLoading && (
                <View className="flex-1 items-center justify-center p-4">
                    <Ionicons name="film-outline" size={36} color="#9ca3af" />
                    <Text className="mt-2 text-gray-600 dark:text-gray-300">No movies found</Text>
                </View>
            )}

            {/* Loaded data */}
            {movies.length > 0 && !moviesQuery.isLoading && (
                <FlatList
                    data={lists}
                    renderItem={renderHorizontalList}
                    keyExtractor={(_, i) => `movie-list-${i}`}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                />
            )}

            {/* Pagination controls */}
            <View className="absolute bottom-16 left-0 right-0 flex-row items-center justify-center">
                <Pressable
                    onPress={prevPage}
                    disabled={searchParams.Page === 1}
                    className={`mx-2 rounded-full p-3 ${searchParams.Page === 1 ? 'bg-gray-200 opacity-50 dark:bg-gray-700' : 'bg-blue-500 dark:bg-blue-600'}`}>
                    <AntDesign
                        name="left"
                        size={16}
                        color={searchParams.Page === 1 ? '#9ca3af' : 'white'}
                    />
                </Pressable>

                <Text className="mx-4 font-medium text-gray-700 dark:text-gray-300">
                    Page {searchParams.Page}
                </Text>

                <Pressable
                    onPress={nextPage}
                    disabled={!moviesQuery.data?.data}
                    className={`mx-2 rounded-full p-3 ${!moviesQuery.data?.data ? 'bg-gray-200 opacity-50 dark:bg-gray-700' : 'bg-blue-500 dark:bg-blue-600'}`}>
                    <AntDesign
                        name="right"
                        size={16}
                        color={!moviesQuery.data?.data ? '#9ca3af' : 'white'}
                    />
                </Pressable>
            </View>

            <Modal
                onClose={() => setIsModalOpen(false)}
                visible={isModalOpen}
                title={selectedItem?.title || 'Details'}>
                <YtsDetailsScreen
                    link={selectedItem?.detailUrl as string}
                    onSelect={onSelectMagnet}
                />
            </Modal>
        </View>
    );
}
