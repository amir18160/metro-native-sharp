import { FlatList, Pressable, View } from 'react-native';
import { useSearchIndexer } from '~/hooks/services/indexer/useSearchIndexer';
import { Error } from '~/components/Error/Error';
import { Loading } from '~/components/Loading/Loading';
import { useEffect } from 'react';
import { IIndexerSearchResult } from '~/types/server/indexers/IIndexerSearchResult';
import SearchResultItem from '../indexers/SearchResultItem';

interface Props {
    query: string;
    onSelect: (magnet: string) => void;
}

export default function IndexerResults({ query, onSelect }: Props) {
    const { mutate, data, isPending, isError } = useSearchIndexer();

    useEffect(() => {
        mutate({ searchQuery: query });
    }, [query, mutate]);

    if (isPending) return <Loading />;
    if (isError || data?.status === 'error') return <Error message="Indexer search failed" />;

    const results = data?.data ?? [];

    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={results}
            keyExtractor={(item, index) => item.guid + index.toString()}
            renderItem={({ item }: { item: IIndexerSearchResult }) => (
                <Pressable onPress={() => onSelect(item.guid)}>
                    <SearchResultItem item={item} />
                </Pressable>
            )}
        />
    );
}
