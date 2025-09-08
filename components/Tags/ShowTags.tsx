// components/ShowTags.tsx
import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, RefreshControl, SafeAreaView } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useQueryTags } from '~/hooks/services/tags/useQueryTags'; // your provided pre-made hook
import { IQueryTagsParams } from '~/services/remote/tagService';
import TagColumn from './TagColumn'; // must exist (renders a vertical stack of TagCompact)
import { Loading } from '../Loading/Loading';
import { Error } from '../Error/Error';
import { Tag } from '~/types/server/tags/tag';
import { TagsFeedDto } from '~/types/server/tags/tag-feed-dto';
import { Entypo, FontAwesome } from '@expo/vector-icons';

/**
 * ShowTags
 * - renders the server feed (TagsFeedDto)
 * - each section is a horizontal FlatList of columns; each column stacks up to COLUMN_SIZE items
 * - onDeleted callback updates local UI + react-query cache
 */

const COLUMN_SIZE = 2; // change to 2 for 2 items/column

/** Normalize server section (array or paged list) -> simple Tag[] */
function normalizeSection(data: any): Tag[] {
    if (!data) return [];
    if (Array.isArray(data)) return data as Tag[];
    if (typeof data === 'object' && Array.isArray(data.items)) return data.items as Tag[];
    return [];
}

/** chunk arr into arrays of length n */
function chunkArray<T>(arr: T[], n: number): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += n) {
        out.push(arr.slice(i, i + n));
    }
    return out;
}

export default function ShowTags() {
    // stable base query params (used as react-query key)
    const baseQueryParams = useMemo<IQueryTagsParams>(() => ({ IncludeOmdbItem: true }), []);

    // pre-made hook (returns ApiResult<TagsFeedDto> as data)
    const {
        data: resp,
        isLoading,
        isError,
        isFetching,
        refetch,
    } = useQueryTags(baseQueryParams, true);

    const queryClient = useQueryClient();

    // Keep a set of locally removed IDs to hide items immediately
    const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

    // Extract feed DTO (resp may be ApiResult<TagsFeedDto>)
    const feed: TagsFeedDto | null = useMemo(() => {
        if (!resp) return null;
        // resp may be ApiResult<TagsFeedDto>
        // some usages: resp.data is the DTO
        // If your hook returns the ApiResult wrapper, adapt accordingly.
        // We handle both: resp?.data?.data (double-wrapped) or resp?.data (single)
        // But according to your earlier examples you wrap with { status, data, messages } -> resp.data.data
        const maybe = (resp as any).data ?? resp;
        // If it's the ApiResult object:
        if (maybe && (maybe.status === 'success' || maybe.status === 'error')) {
            return maybe.data ?? null;
        }
        // otherwise assume it's already the DTO
        return maybe as TagsFeedDto | null;
    }, [resp]);

    // derive sections arrays and filter out locally removed ids
    const pinned = useMemo(
        () => normalizeSection(feed?.pinned).filter((t) => !removedIds.has(t.id)),
        [feed, removedIds]
    );
    const recommended = useMemo(
        () => normalizeSection(feed?.recommended).filter((t) => !removedIds.has(t.id)),
        [feed, removedIds]
    );
    const newItems = useMemo(
        () => normalizeSection(feed?.new).filter((t) => !removedIds.has(t.id)),
        [feed, removedIds]
    );
    const newTopRated = useMemo(
        () => normalizeSection(feed?.newTopRated).filter((t) => !removedIds.has(t.id)),
        [feed, removedIds]
    );
    const updatedMovies = useMemo(
        () => normalizeSection((feed as any)?.updatedMovies).filter((t) => !removedIds.has(t.id)),
        [feed, removedIds]
    );
    const updatedSeries = useMemo(
        () => normalizeSection((feed as any)?.updatedSeries).filter((t) => !removedIds.has(t.id)),
        [feed, removedIds]
    );

    const sections = useMemo(
        () => [
            { key: 'Pinned', title: 'pinned', items: pinned },
            { key: 'recommended', title: 'Recommended', items: recommended },
            { key: 'new', title: 'New', items: newItems },
            { key: 'newTopRated', title: 'New Top Rated', items: newTopRated },
            { key: 'updatedMovies', title: 'Updated Movies', items: updatedMovies },
            { key: 'updatedSeries', title: 'Updated Series', items: updatedSeries },
        ],
        [pinned, recommended, newItems, newTopRated, updatedMovies, updatedSeries]
    );

    // onDeleted handler: remove locally and update react-query cache for the same key
    const handleDeleted = useCallback(
        (id: string) => {
            setRemovedIds((prev) => {
                const n = new Set(prev);
                n.add(id);
                return n;
            });

            // update react-query cached data for key: ['query-tags', baseQueryParams]
            queryClient.setQueryData(['query-tags', baseQueryParams], (oldData: any) => {
                if (!oldData) return oldData;

                // oldData may be ApiResult<TagsFeedDto> or TagsFeedDto depending on your hook
                let wrapper = oldData;
                let dto: any = null;

                if (oldData.data && (oldData.status === 'success' || oldData.status === 'error')) {
                    // ApiResult wrapper shape
                    wrapper = { ...oldData };
                    dto = { ...(oldData.data ?? {}) };
                    wrapper.data = dto;
                } else {
                    // direct dto
                    dto = { ...oldData };
                    wrapper = dto;
                }

                // helper to remove from section
                const removeFrom = (key: string) => {
                    if (!dto) return;
                    const current = dto[key];
                    if (!current) return;
                    if (Array.isArray(current)) {
                        dto[key] = current.filter((it: Tag) => it.id !== id);
                        return;
                    }
                    if (Array.isArray(current.items)) {
                        dto[key] = {
                            ...current,
                            items: current.items.filter((it: Tag) => it.id !== id),
                        };
                    }
                };

                removeFrom('recommended');
                removeFrom('new');
                removeFrom('newTopRated');
                removeFrom('updatedMovies');
                removeFrom('updatedSeries');

                return wrapper;
            });
        },
        [queryClient, baseQueryParams]
    );

    // Refresh handler
    const onRefresh = useCallback(async () => {
        setRemovedIds(new Set());
        await refetch();
    }, [refetch]);

    const renderSection = useCallback(
        ({ item }: { item: { key: string; title: string; items: Tag[] } }) => {
            const chunks = chunkArray(item.items, COLUMN_SIZE); // each chunk is a column
            return (
                <View style={{ paddingHorizontal: 12, paddingBottom: 18 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>
                        {item.title}
                    </Text>
                    {chunks.length === 0 ? (
                        <View className="w-52 flex-row items-center justify-center gap-3 border-slate-100 bg-white p-3">
                            <Entypo name="circle-with-cross" size={24} color="black" />
                            <Text style={{ color: '#666' }}>No items</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={chunks}
                            keyExtractor={(_, idx) => `${item.key}-col-${idx}`}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item: chunk }) => (
                                <TagColumn chunk={chunk} onDeleted={handleDeleted} />
                            )}
                        />
                    )}
                </View>
            );
        },
        [handleDeleted]
    );

    // Loading / error UI
    if (isLoading) {
        return <Loading />;
    }
    if (isError && !feed) {
        return <Error message="Failed to load tags feed" />;
    }

    // render section row (horizontal columns)

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F7F8' }}>
            <View style={{ padding: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: '700' }}>Tags Feed</Text>
            </View>

            <FlatList
                data={sections}
                keyExtractor={(s) => s.key}
                refreshControl={<RefreshControl refreshing={isFetching} onRefresh={onRefresh} />}
                renderItem={renderSection}
                ListEmptyComponent={() => (
                    <View style={{ padding: 24, alignItems: 'center' }}>
                        <Text style={{ color: '#666' }}>No tags available</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}
