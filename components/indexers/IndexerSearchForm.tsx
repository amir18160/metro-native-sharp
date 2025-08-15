// components/search/SearchForm.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { ISearchIndexer } from '~/services/remote/indexerService';

type SearchFormProps = {
    onSearch: (params: Omit<ISearchIndexer, 'Offset' | 'limit'>) => void;
    isLoading: boolean;
};

export default function IndexerSearchForm({ onSearch, isLoading }: SearchFormProps) {
    const [query, setQuery] = useState('');

    const handlePress = () => {
        if (!query.trim() || isLoading) return;

        onSearch({
            searchQuery: query,
            type: 'search',
            categoryIds: [],
            indexerIds: [],
        });
    };

    return (
        <View>
            <TextInput
                placeholder="مثلا: The Matrix"
                value={query}
                onChangeText={setQuery}
                className="mb-3 w-full rounded-lg border border-gray-300 bg-white p-4 text-right text-lg"
                placeholderTextColor="#9CA3AF"
                style={{ textAlign: 'right' }}
            />

            <TouchableOpacity
                onPress={handlePress}
                disabled={isLoading}
                className={`flex-row items-center justify-center rounded-lg p-4 ${isLoading ? 'bg-blue-300' : 'bg-blue-600 active:bg-blue-700'}`}>
                {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text className="text-center font-bold text-lg text-white">بگرد</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}
