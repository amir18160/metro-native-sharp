import { useState } from 'react';
import { View, TextInput } from 'react-native';
import { SearchableMediaList } from '~/components/common/SearchableMediaList';

export default function SearchMedia() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <View className="flex-1 bg-white p-4">
            <SearchableMediaList />
        </View>
    );
}
