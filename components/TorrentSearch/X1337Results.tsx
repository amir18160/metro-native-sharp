import { View, Text, FlatList } from 'react-native';
import { useSearch1337x } from '~/hooks/services/scrapers/useSearch1337x';
import { Error } from '~/components/Error/Error';
import { Loading } from '~/components/Loading/Loading';
import { useEffect } from 'react';
import { X1337Preview } from '~/types/server/scrapers/x1337-preview';

interface Props {
    query: string;
    onSelect: (magnet: string) => void;
}

export default function X1337Results({ query }: Props) {
    const search1337x = useSearch1337x({ searchTerm: query }, false);

    useEffect(() => {
        search1337x.refetch();
    }, [query, search1337x]);

    if (search1337x.isLoading) return <Loading />;
    if (search1337x.isError || search1337x.data?.status === 'error')
        return <Error message="1337x search failed" />;

    const results = search1337x.data?.data ?? [];

    return (
        <FlatList
            data={results}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }: { item: X1337Preview }) => (
                <View className="border-b border-gray-300 p-3">
                    <Text className="font-bold text-base text-slate-800">{item.name}</Text>
                    <Text className="text-sm text-gray-400">
                        Seeds: {item.seeds ?? '0'} | Leeches: {item.leeches ?? '0'}
                    </Text>
                </View>
            )}
        />
    );
}
