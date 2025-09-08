import { Pressable, View, Image } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { Movie } from '~/types/server/tmdb/movie';
import { TvShow } from '~/types/server/tmdb/tv-show';
import Animated, {
    FadeInUp,
    FadeInDown,
    ZoomIn,
    withRepeat,
    withSpring,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
} from 'react-native-reanimated';
import fallbackPoster from '~/assets/movie/FallbackSearch.png';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';

interface SelectedMediaDetailsCardProps {
    data: Movie | TvShow | null | undefined;
    type: 'movie' | 'tv';
    storedMovieName?: string;
    onPress?: () => void;
}

export function SelectedMediaDetailsCard({
    data,
    type,
    storedMovieName,
    onPress,
}: SelectedMediaDetailsCardProps) {
    // Bounce animation for pressable
    const scale = useSharedValue(1);

    const pressableStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.95);
    };
    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    // Floating animation for empty state icon
    const float = useSharedValue(0);
    useEffect(() => {
        float.value = withRepeat(withSequence(withSpring(-5), withSpring(5)), -1, true);
    }, [float]);

    const floatStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: float.value }],
    }));

    if (!data) {
        return (
            <Pressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                className="overflow-hidden rounded-2xl">
                <Animated.View style={pressableStyle}>
                    <LinearGradient
                        colors={['#f0f4ff', '#e0e7ff', '#ede9fe']}
                        className="h-44 items-center justify-center px-4">
                        <Animated.View entering={ZoomIn.springify()} style={floatStyle}>
                            {storedMovieName ? (
                                <AntDesign name="checkcircle" size={60} color="#51cf66" />
                            ) : (
                                <Ionicons name="film-outline" size={60} color="#6366f1" />
                            )}
                        </Animated.View>

                        <Animated.Text
                            entering={FadeInDown.delay(200)}
                            className="mt-4 text-center font-bold text-base text-indigo-700">
                            {storedMovieName
                                ? `Movie "${storedMovieName}" is already selected`
                                : 'No media selected'}
                        </Animated.Text>

                        <Animated.Text
                            entering={FadeInUp.delay(400)}
                            className="mt-1 text-center text-sm text-indigo-500">
                            {storedMovieName
                                ? 'Tap here to select another movie'
                                : 'Tap here to select one'}
                        </Animated.Text>
                    </LinearGradient>
                </Animated.View>
            </Pressable>
        );
    }

    const title = type === 'movie' ? (data as Movie).title : (data as TvShow).name;
    const year =
        type === 'movie'
            ? (data as Movie).releaseDate
                ? new Date((data as Movie).releaseDate).getFullYear()
                : null
            : (data as TvShow).firstAirDate
              ? new Date((data as TvShow).firstAirDate).getFullYear()
              : null;

    const posterPath = type === 'movie' ? (data as Movie).posterPath : (data as TvShow).posterPath;

    const tagline = type === 'movie' ? (data as Movie).tagline : (data as TvShow).tagline;
    const genres = type === 'movie' ? (data as Movie).genres : (data as TvShow).genres;
    const overview = type === 'movie' ? (data as Movie).overview : (data as TvShow).overview;
    const voteAverage =
        type === 'movie' ? (data as Movie).voteAverage : (data as TvShow).voteAverage;
    const voteCount = type === 'movie' ? (data as Movie).voteCount : (data as TvShow).voteCount;
    const runtime =
        type === 'movie' ? (data as Movie).runtime : (data as TvShow).episodeRunTime?.[0];
    const seasonCount = type === 'tv' ? (data as TvShow).numberOfSeasons : null;

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            className="overflow-hidden rounded-2xl">
            <Animated.View
                style={pressableStyle}
                entering={FadeInUp.springify()}
                className="min-h-48 flex-row rounded-2xl border border-slate-200 bg-gray-50 p-3">
                {/* Poster */}
                <Image
                    source={
                        posterPath
                            ? { uri: `https://image.tmdb.org/t/p/original${posterPath}` }
                            : fallbackPoster
                    }
                    className="mr-4 h-44 w-28 rounded-xl"
                    resizeMode="cover"
                />

                {/* Info */}
                <View className="flex-1">
                    {/* Title */}
                    <Text className="font-bold text-lg text-black" numberOfLines={1}>
                        {title} {year ? `(${year})` : ''}
                    </Text>

                    {/* Tagline */}
                    {tagline ? (
                        <Text className="mt-0.5 text-xs italic text-gray-500" numberOfLines={1}>
                            {tagline}
                        </Text>
                    ) : null}

                    {/* Genres */}
                    {genres?.length ? (
                        <Text className="mt-1 text-xs text-gray-600" numberOfLines={1}>
                            {genres.map((g) => g.name).join(', ')}
                        </Text>
                    ) : null}

                    {/* Rating */}
                    {voteAverage ? (
                        <View className="mt-2 flex-row items-center">
                            <Ionicons name="star" size={14} color="#facc15" />
                            <Text className="ml-1 text-xs text-gray-700">
                                {voteAverage.toFixed(1)} ({voteCount || 0})
                            </Text>
                        </View>
                    ) : null}

                    {/* Runtime / Seasons */}
                    {type === 'movie' && runtime ? (
                        <Text className="mt-1 text-xs text-gray-500">
                            {Math.floor(runtime / 60)}h {runtime % 60}m
                        </Text>
                    ) : null}

                    {type === 'tv' && seasonCount ? (
                        <Text className="mt-1 text-xs text-gray-500">
                            {seasonCount} {seasonCount > 1 ? 'Seasons' : 'Season'}
                        </Text>
                    ) : null}

                    {/* Overview */}
                    {overview ? (
                        <Text className="mt-2 text-xs leading-4 text-gray-700" numberOfLines={3}>
                            {overview}
                        </Text>
                    ) : (
                        <Text className="mt-2 text-xs italic text-gray-400">
                            No description available.
                        </Text>
                    )}
                </View>
            </Animated.View>
        </Pressable>
    );
}
