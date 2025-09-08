import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OmdbItem } from '~/types/server/omdb/omdb-item';

interface Props {
    item?: OmdbItem | null;
    showPlot?: boolean;
}

const OmdbItemCard: React.FC<Props> = ({ item, showPlot = false }) => {
    if (!item) {
        return (
            <View className="flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <Ionicons name="film-outline" size={48} color="#9CA3AF" />
                <Text className="mt-3 text-lg text-gray-500">No movie selected</Text>
                <Text className="mt-1 text-sm text-gray-400">
                    Please choose a movie to see details.
                </Text>
            </View>
        );
    }

    // Format ratings
    const imdb = item.imdbRating ? (Math.round(item.imdbRating * 10) / 10).toFixed(1) : null;

    const plotText = showPlot
        ? item.plot
        : item.plot.length > 120
          ? item.plot.slice(0, 120) + '...'
          : item.plot;

    return (
        <View className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            {/* Top row: poster + details */}
            <View className="flex-row">
                {/* Poster */}
                {item.poster ? (
                    <Image
                        source={{ uri: item.poster }}
                        className="mr-4 h-40 w-28 rounded-lg"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="mr-4 h-40 w-28 items-center justify-center rounded-lg bg-gray-200">
                        <Ionicons name="image-outline" size={28} color="#9CA3AF" />
                        <Text className="mt-1 text-xs text-gray-500">No Poster</Text>
                    </View>
                )}

                {/* Details */}
                <View className="flex-1 justify-between">
                    <View>
                        <Text className="font-bold text-xl text-gray-900">
                            {item.title} {item.year ? `(${item.year})` : ''}
                        </Text>
                        <Text className="mt-1 text-sm text-gray-600">
                            {item.rated} • {item.released} • {item.runtime}
                        </Text>
                    </View>

                    {/* Plot preview */}
                    {plotText ? (
                        <Text className="mt-2 text-sm text-gray-700">{plotText}</Text>
                    ) : null}
                </View>
            </View>

            {/* Genres */}
            {item.genres?.length > 0 && (
                <View className="mt-3 flex-row flex-wrap">
                    {item.genres.map((g) => (
                        <View
                            key={g}
                            className="mb-2 mr-2 flex-row items-center rounded-full border border-gray-200 bg-white px-2 py-1">
                            <Ionicons name="pricetag-outline" size={12} color="#6B7280" />
                            <Text className="ml-1 text-xs text-gray-700">{g}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Ratings */}
            <View className="mt-2 flex-row flex-wrap">
                {imdb && (
                    <View className="mb-2 mr-4 flex-row items-center">
                        <Ionicons name="star" size={14} color="#FACC15" />
                        <Text className="ml-1 text-sm text-gray-800">IMDb {imdb}</Text>
                    </View>
                )}
                {item.metascore !== undefined && (
                    <View className="mb-2 mr-4 flex-row items-center">
                        <Ionicons name="ribbon-outline" size={14} color="#22C55E" />
                        <Text className="ml-1 text-sm text-gray-800">
                            Metascore {item.metascore}
                        </Text>
                    </View>
                )}
                {item.rottenTomatoesScore !== undefined && (
                    <View className="mb-2 mr-4 flex-row items-center">
                        <Ionicons name="leaf-outline" size={14} color="#DC2626" />
                        <Text className="ml-1 text-sm text-gray-800">
                            RT {item.rottenTomatoesScore}%
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default OmdbItemCard;
