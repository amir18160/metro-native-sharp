import { View, Text, FlatList, Pressable } from 'react-native';
import { useSearchRARBG } from '~/hooks/services/scrapers/useSearchRARBG';
import { Error } from '~/components/Error/Error';
import { Loading } from '~/components/Loading/Loading';
import { useEffect, useState } from 'react';
import { RarbgPreview } from '~/types/server/scrapers/rarbg-preview';
import Modal from '../common/Modal';
import RarbgDetailsScreen from './RarbgDetailsScreen';

interface Props {
    query: string;
    onSelect: (magnet: string) => void;
}

export default function RarbgResults({ query, onSelect }: Props) {
    const searchRARBG = useSearchRARBG({ searchTerm: query }, false);
    const [selectedItem, setSelectedItem] = useState<RarbgPreview | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        searchRARBG.refetch();
    }, [query, searchRARBG]);

    if (searchRARBG.isLoading) return <Loading />;
    if (searchRARBG.isError || searchRARBG.data?.status === 'error')
        return <Error message="RARBG search failed" />;

    const results = searchRARBG.data?.data ?? [];

    return (
        <>
            <FlatList
                data={results}
                keyExtractor={(item, index) => item.categoryHref + index.toString()}
                renderItem={({ item }: { item: RarbgPreview }) => (
                    <Pressable
                        onPress={() => {
                            setSelectedItem(item);
                            setIsModalOpen(true);
                        }}>
                        <View className="border-b border-gray-300 p-3">
                            <Text className="font-bold text-base text-slate-700">
                                {item.title ?? 'Untitled'}
                            </Text>
                            <Text className="text-sm text-slate-800">
                                Seeders: {item.seeders ?? 0} | Leechers: {item.leechers ?? 0}
                            </Text>
                        </View>
                    </Pressable>
                )}
            />
            {selectedItem && (
                <Modal
                    onClose={() => setIsModalOpen(false)}
                    visible={isModalOpen}
                    title="Torrent Details">
                    <RarbgDetailsScreen link={selectedItem.titleHref} onSelect={onSelect} />
                </Modal>
            )}
        </>
    );
}
