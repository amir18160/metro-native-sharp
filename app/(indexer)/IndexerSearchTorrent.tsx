// screens/SearchTorrent.js
import React, { useState, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Keyboard } from 'react-native';
import IndexerSearchForm from '~/components/indexers/IndexerSearchForm';
import SearchResultItem from '~/components/indexers/SearchResultItem';
import { Text } from '~/components/nativewindui/Text';
import { useSearchIndexer } from '~/hooks/services/indexer/useSearchIndexer';
import { ISearchIndexer } from '~/services/remote/indexerService';
import { IIndexerSearchResult } from '~/types/server/indexers/IIndexerSearchResult';

export default function IndexerSearchTorrent() {
    // 👇 Use the imported IIndexerSearchResult type for state
    const [searchResults, setSearchResults] = useState<IIndexerSearchResult[]>([]);
    const searchMutation = useSearchIndexer();

    const handleSearch = useCallback(
        (params: Omit<ISearchIndexer, 'Offset' | 'limit'>) => {
            Keyboard.dismiss();
            setSearchResults([]);

            const searchParams = {
                ...params,
                Offset: 0,
                limit: 50,
            };

            searchMutation.mutate(searchParams, {
                onSuccess: (response) => {
                    if (response.status === 'success' && response.data) {
                        setSearchResults(response.data);
                    } else {
                        console.error('Search failed:', response.messages);
                    }
                },
            });
        },
        [searchMutation]
    );

    const renderEmptyComponent = () => (
        <View className="flex-1 items-center justify-center p-8">
            {!searchMutation.isPending && searchResults.length === 0 && (
                <>
                    <Text className="mb-2 text-2xl">🔎</Text>
                    <Text className="font-semibold text-lg text-gray-700">چیزی پیدا نشد</Text>
                    <Text className="mt-1 text-center text-gray-500">
                        برای جستجو، عبارت مورد نظر را وارد کرده و دکمه جستجو را بزنید
                    </Text>
                </>
            )}
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <View className="border-b border-gray-200 bg-white p-4">
                <Text className="mb-4 font-bold text-2xl text-black">جستجوی تورنت</Text>
                <IndexerSearchForm onSearch={handleSearch} isLoading={searchMutation.isPending} />
            </View>

            {searchMutation.isPending && (
                <View className="py-4">
                    <ActivityIndicator size="large" color="#2563EB" />
                    <Text className="mt-2 text-center text-gray-500">در حال جستجو...</Text>
                </View>
            )}

            <FlatList
                data={searchResults}
                keyExtractor={(item) => item.guid}
                renderItem={({ item }) => <SearchResultItem item={item} />} // Pass the full item
                contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 16 }}
                ListEmptyComponent={renderEmptyComponent}
                ItemSeparatorComponent={() => <View className="h-3" />}
            />
        </View>
    );
}
