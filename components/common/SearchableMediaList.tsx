import { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { useSearchMulti } from '~/hooks/services/tmdb/useSearchMulti';
import { MediaType } from '~/types/server/tmdb/media-type';
import { CustomImage } from '~/components/common/CustomImage';
import fallbackPoster from '~/assets/movie/FallbackSearch.png';
import { TMDbMedia } from '~/types/server/tmdb/tm-db-media';
import AnimatedTextField from './AnimatedTextField';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useDebouncedValue } from '~/hooks/general/useDebouncedValue';

interface SearchableMediaListProps {
    placeholder?: string;
    onSelect?: (media: TMDbMedia) => void;
}

const { height } = Dimensions.get('window');

export function SearchableMediaList({
    placeholder = 'Search movies, TV shows, people...',
    onSelect = () => {},
}: SearchableMediaListProps) {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebouncedValue(query, 500);
    const [selectingId, setSelectingId] = useState<number | null>(null);

    const { data, isLoading, isError } = useSearchMulti({
        searchQuery: debouncedQuery,
        enabled: query.trim().length > 0,
    });

    function handleSelect(media: TMDbMedia) {
        setSelectingId(media.id);
        onSelect(media);
    }

    const results = data?.data ?? [];

    return (
        <View className="flex-1 bg-white">
            {/* Fixed Search Bar */}
            <View className="z-10 border-b border-gray-200 bg-white p-3">
                <AnimatedTextField
                    showPasteButton
                    placeholder={placeholder}
                    value={query}
                    onChangeText={setQuery}
                    iconLeft={<Ionicons name="search" size={20} color="white" />}
                />
            </View>

            {/* List Container */}
            <View style={{ height: height - 70 }}>
                {/* Loading State */}
                {isLoading && (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="small" />
                        <Text className="mt-2 text-gray-500">Searching...</Text>
                    </View>
                )}

                {/* Error State */}
                {isError && (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-red-500">Something went wrong.</Text>
                    </View>
                )}

                {/* Empty State */}
                {!isLoading && query.trim().length > 0 && results.length === 0 && (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-gray-500">No results found.</Text>
                    </View>
                )}

                {/* Animated List */}
                {data && (
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        renderItem={({ item, index }) => (
                            <Animated.View
                                entering={FadeInUp.delay(index * 60).springify()}
                                exiting={FadeOutUp}>
                                <TouchableOpacity
                                    className="flex-row items-center border-b border-gray-100 p-3 active:opacity-70"
                                    onPress={() => handleSelect(item)}
                                    disabled={!!selectingId}>
                                    {/* Poster */}
                                    <CustomImage
                                        source={item.poster ? { uri: item.poster } : fallbackPoster}
                                        fallbackSource={fallbackPoster}
                                        className="mr-3 h-14 w-10 rounded-lg"
                                        resizeMode="cover"
                                        defaultSource={fallbackPoster}
                                        resizeMethod="resize"
                                    />

                                    {/* Info */}
                                    <View className="flex-1">
                                        <Text
                                            className="font-semibold text-base text-black"
                                            numberOfLines={1}>
                                            {item.title || item.originalTitle}
                                        </Text>
                                        <Text className="text-xs text-gray-500">
                                            {item.mediaType === MediaType.Movie && 'Movie'}
                                            {item.mediaType === MediaType.Tv && 'TV Show'}
                                            {item.mediaType === MediaType.Person && 'Person'}
                                        </Text>
                                        {item.releaseDate && (
                                            <Text className="text-xs text-gray-400">
                                                {new Date(item.releaseDate).getFullYear()}
                                            </Text>
                                        )}
                                    </View>

                                    {/* Loading Indicator on Select */}
                                    {selectingId === item.id && (
                                        <ActivityIndicator size="small" color="#000" />
                                    )}
                                </TouchableOpacity>
                            </Animated.View>
                        )}
                    />
                )}
            </View>
        </View>
    );
}
