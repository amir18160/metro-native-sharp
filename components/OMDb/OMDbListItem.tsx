import { View, Text, Pressable, Image } from 'react-native';
import React from 'react';
import { OmdbItem } from '~/types/server/omdb/omdb-item';
import { FontAwesome } from '@expo/vector-icons';
import { omdbItemTypeToString } from '~/utilities/enumConverter';

interface IProps {
    item: OmdbItem;
    onSelect: (item: OmdbItem) => void;
}

export default function OMDbListItem({ item, onSelect }: IProps) {
    const rating = item.imdbRating ? item.imdbRating.toFixed(1) : null;

    return (
        <Pressable
            onPress={() => onSelect(item)}
            // Reduced padding and gaps for a tighter layout
            className="flex-row items-center gap-3 border-b border-slate-200 bg-white p-2.5 active:bg-slate-100">
            {/* --- Poster (Smaller) --- */}
            {/* The background color acts as a placeholder for missing images or during load */}
            <Image
                source={{ uri: item.poster }}
                className="h-20 w-14 shrink-0 rounded-md bg-slate-200"
            />

            {/* --- Text Block (Consolidated) --- */}
            <View className="flex-1">
                <Text className="font-bold text-sm text-slate-800" numberOfLines={1}>
                    {item.title}
                </Text>

                {/* Secondary info (year, type, rating) is on a single line */}
                <View className="mt-1 flex-row items-center justify-between">
                    <Text className="text-xs text-slate-500">
                        {item.year} • {omdbItemTypeToString(item.type)}
                    </Text>

                    {/* Display rating only if it's valid */}
                    {rating && (
                        <View className="flex-row items-center gap-1">
                            <FontAwesome name="star" size={12} color="#f59e0b" />
                            <Text className="font-semibold text-xs text-slate-600">{rating}</Text>
                        </View>
                    )}
                </View>
            </View>
        </Pressable>
    );
}
