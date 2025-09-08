import { View, Pressable, FlatList } from 'react-native';
import React, { useState } from 'react';
import Modal from '../common/Modal';
import AnimatedTextField from '../common/AnimatedTextField';
import { FontAwesome } from '@expo/vector-icons';
import { useDebouncedValue } from '~/hooks/general/useDebouncedValue';
import { useInfiniteQueryOMDb } from '~/hooks/services/omdb/useInfiniteQueryOMDb';
import { IQueryOMDbParams } from '~/services/remote/omdbService';
import { Error } from '../Error/Error';
import { Loading } from '../Loading/Loading';
import { OmdbItem } from '~/types/server/omdb/omdb-item';
import OMDbListItem from './OMDbListItem';

interface IProps {
    onSelect: (item: OmdbItem | null) => void;
    CustomComponentAsButton?: (props: { onPress: () => void }) => React.ReactNode;
    value: string;
}

export default function SelectOMDbItem({ value, onSelect, CustomComponentAsButton }: IProps) {
    const [isOMDbModalOpen, setIsOMDbModalOpen] = useState(false);
    const [query, setQuery] = useState<IQueryOMDbParams>({
        pageNumber: 1,
        pageSize: 20,
    });
    const debouncedQuery = useDebouncedValue(query, 500);

    const queryOMDb = useInfiniteQueryOMDb(debouncedQuery, true);

    const items: OmdbItem[] = queryOMDb.data?.pages.flatMap((page) => page.data?.items ?? []) ?? [];

    const loadMore = () => {
        if (queryOMDb.hasNextPage && !queryOMDb.isFetchingNextPage) {
            queryOMDb.fetchNextPage();
        }
    };

    const handlePress = (item: OmdbItem) => {
        onSelect(item);
        setIsOMDbModalOpen(false);
    };

    const renderItem = ({ item }: { item: OmdbItem }) => {
        return <OMDbListItem item={item} onSelect={handlePress} />;
    };

    const renderButton = () => {
        if (CustomComponentAsButton) {
            return CustomComponentAsButton({ onPress: () => setIsOMDbModalOpen(true) });
        }
        return (
            <Pressable onPress={() => setIsOMDbModalOpen(true)}>
                <AnimatedTextField
                    placeholder="Enter OMDB Id"
                    iconLeft={<FontAwesome name="imdb" size={20} color="white" />}
                    onChangeText={() => {}}
                    value={value}
                    label="OMDb ID"
                    labelColor="text-slate-700"
                    disabled
                    onRemove={() => onSelect(null)}
                />
            </Pressable>
        );
    };

    return (
        <View>
            {/* Open modal button */}
            {renderButton()}

            <Modal
                onClose={() => setIsOMDbModalOpen(false)}
                visible={isOMDbModalOpen}
                title="Select OMDb Item"
                scrollable={false}>
                <View className="flex-1">
                    {/* Static search bar */}
                    <View className="absolute -top-2 left-0 right-0 z-10 bg-white pb-1">
                        <AnimatedTextField
                            placeholder="Search by Title"
                            iconLeft={<FontAwesome name="search" size={16} color="white" />}
                            onChangeText={(text) =>
                                setQuery({ ...query, title: text, pageNumber: 1 })
                            }
                            value={query.title ?? ''}
                        />
                    </View>

                    {/* Results list */}
                    <View className="mt-16 flex-1">
                        {queryOMDb.isError ? (
                            <Error message="Something went wrong" />
                        ) : queryOMDb.isPending && items.length === 0 ? (
                            <Loading />
                        ) : (
                            <FlatList
                                data={items}
                                extraData={items}
                                keyExtractor={(item) => item.id}
                                renderItem={renderItem}
                                onEndReached={loadMore}
                                onEndReachedThreshold={0.5}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}
