import React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { IIndexerSearchResult } from '~/types/server/indexers/IIndexerSearchResult';

const formatBytes = (bytes: number | null, decimals = 1) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`;
};

interface SearchResultItemProps {
    item: IIndexerSearchResult;
}

export default function SearchResultItem({ item }: SearchResultItemProps) {
    return (
        <View className="rounded-md border border-gray-200 bg-white px-3 py-2 shadow-sm">
            {/* Title */}
            <Text className="font-semibold text-sm leading-5 text-black" numberOfLines={2}>
                {item.title}
            </Text>

            <View className="flex-row-reverse items-center justify-between">
                {item.categories?.length > 0 && (
                    <View className="mt-1 flex-row flex-wrap justify-end">
                        {item.categories.map(
                            (cat) =>
                                cat.name !== null && (
                                    <View
                                        key={cat.id}
                                        className="mb-1 ml-1 rounded-full bg-blue-100 px-1.5 py-0.5">
                                        <Text className="font-medium text-[10px] text-blue-800">
                                            {cat.name}
                                        </Text>
                                    </View>
                                )
                        )}
                    </View>
                )}

                {/* Details row */}
                <View className="mt-1 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <View className="mr-3 flex-row items-center">
                            <Text className="font-bold text-green-600">▲</Text>
                            <Text className="ml-0.5 text-xs text-green-600">
                                {item.seeders ?? '0'}
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <Text className="font-bold text-red-600">▼</Text>
                            <Text className="ml-0.5 text-xs text-red-600">
                                {item.leechers ?? '0'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <View className="flex-row items-center justify-between">
                <Text className="mt-1 text-[10px] text-gray-500" style={{ textAlign: 'right' }}>
                    {item.indexer}
                </Text>
                <Text className="text-xs text-gray-700">{formatBytes(item.size)}</Text>
            </View>
        </View>
    );
}
