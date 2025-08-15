// screens/Indexers.js
import React, { useState } from 'react';
import { View, ActivityIndicator, FlatList } from 'react-native';
import IndexerDetailModal from '~/components/indexers/IndexerDetailModal';
import IndexerListItem from '~/components/indexers/IndexerListItem';
import { Text } from '~/components/nativewindui/Text';
import { useGetIndexerProviders } from '~/hooks/services/indexer/useGetIndexerProviders';
import { IIndexer } from '~/types/server/indexers/IIndexer';

export default function Indexers() {
    const { data, isLoading, isError, error } = useGetIndexerProviders();
    const [selectedItem, setSelectedItem] = useState<IIndexer | null>(null);

    // Loading State
    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#4B5563" />
                <Text className="mt-2 text-gray-500">Loading indexers...</Text>
            </View>
        );
    }

    // Error State
    if (isError) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text className="text-center text-red-500">
                    {error instanceof Error ? error.message : 'An unexpected error occurred'}
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <View className="p-4">
                <Text className="font-bold text-2xl text-black">Indexer Providers</Text>
            </View>

            {/* Data List */}
            <FlatList
                data={data?.data ?? []}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
                renderItem={({ item }) => (
                    <IndexerListItem
                        item={item}
                        onPress={() => setSelectedItem(item)} // Set the item to open in the modal
                    />
                )}
                ItemSeparatorComponent={() => <View className="h-2" />} // Adds space between items
            />

            {/* Detail Modal */}
            {selectedItem && (
                <IndexerDetailModal
                    item={selectedItem}
                    visible={!!selectedItem}
                    onClose={() => setSelectedItem(null)} // Close the modal
                />
            )}
        </View>
    );
}
