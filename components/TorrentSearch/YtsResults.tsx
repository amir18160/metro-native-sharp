import { View, Text, Image, FlatList, Pressable } from 'react-native';
import { useSearchYts } from '~/hooks/services/scrapers/useSearchYts';
import { Error } from '~/components/Error/Error';
import { Loading } from '~/components/Loading/Loading';
import { useEffect, useState } from 'react';
import { YtsPreview } from '~/types/server/scrapers/yts-preview';
import Modal from '../common/Modal';
import YtsDetailsScreen from './YtsDetailsScreen';

interface Props {
    query: string;
    onSelect: (magnet: string) => void;
}

export default function YtsResults({ query, onSelect }: Props) {
    const { refetch, isError, data, isLoading } = useSearchYts({ searchTerm: query }, false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<YtsPreview | null>(null);

    useEffect(() => {
        refetch();
    }, [query, refetch]);

    const onSelectItem = (item: YtsPreview) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    if (isLoading) return <Loading />;
    if (isError || data?.status === 'error' || data?.data?.length === 0)
        return <Error message="YTS search failed" />;

    const results = data?.data ?? [];

    return (
        <>
            <FlatList
                data={results}
                keyExtractor={(item, index) => index.toString() + item.detailUrl}
                renderItem={({ item }: { item: YtsPreview }) => (
                    <Pressable onPress={() => onSelectItem(item)}>
                        <View className="flex-row items-center border-b border-gray-300 p-3">
                            {item.imageUrl && (
                                <Image
                                    source={{ uri: item.imageUrl }}
                                    className="mr-3 h-16 w-12 rounded"
                                />
                            )}
                            <View>
                                <Text className="font-bold text-base text-slate-800">
                                    {item.title ?? 'Untitled'}
                                </Text>
                                <Text className="text-sm text-gray-400">
                                    {item.year ?? ''} | {item.rating ?? 'N/A'}
                                </Text>
                            </View>
                        </View>
                    </Pressable>
                )}
            />
            {selectedItem && (
                <Modal
                    onClose={() => setIsModalOpen(false)}
                    visible={isModalOpen}
                    title="Torrent Details">
                    <YtsDetailsScreen link={selectedItem?.detailUrl} onSelect={onSelect} />
                </Modal>
            )}
        </>
    );
}
