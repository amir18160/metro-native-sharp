import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Pressable,
    ActivityIndicator,
    Image,
} from 'react-native';
import { useDeleteTag } from '~/hooks/services/tags/useDeleteTag';
import { Ionicons } from '@expo/vector-icons';
import { Tag } from '~/types/server/tags/tag';
import { formatRelativeDate } from '~/utilities/formatRelativeDate';

type Props = {
    tag: Tag;
    compact?: boolean;
    onDeleted?: (id: string) => void;
};

export default function TagCompact({ tag, compact = true, onDeleted }: Props) {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const deleteMutation = useDeleteTag();

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync(tag.id);
            onDeleted?.(tag.id);
        } catch (err: any) {
            const message = err?.message ?? 'Failed to delete tag';
            setErrorMsg(message);
            setShowErrorModal(true);
        }
    };

    const omdb = tag.omdbSummary;

    return (
        <View
            style={{
                width: compact ? 220 : '100%',
                padding: compact ? 8 : 12,
                marginBottom: 6,
                backgroundColor: '#fff',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#eee',
                flexDirection: 'row',
            }}>
            {/* Poster */}
            {omdb?.poster ? (
                <Image
                    source={{ uri: omdb.poster }}
                    style={{
                        width: 60,
                        height: 90,
                        borderRadius: 6,
                        marginRight: 10,
                        backgroundColor: '#f0f0f0',
                    }}
                    resizeMode="cover"
                />
            ) : null}

            {/* Content */}
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                    }}>
                    <View style={{ flex: 1 }}>
                        <Text numberOfLines={2} style={{ fontSize: 13, fontWeight: '600' }}>
                            {tag.description || '—'}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={{ fontSize: 11, color: '#666', marginTop: 6 }}>
                            {omdb?.title ?? 'Unknown'}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={{ fontSize: 11, color: '#666', marginTop: 6 }}>
                            {formatRelativeDate(tag.createdAt, true)}
                        </Text>

                        {/* Ratings */}
                        {omdb?.imdbRating ? (
                            <Text style={{ fontSize: 11, color: '#444', marginTop: 4 }}>
                                ⭐ {omdb.imdbRating.toFixed(1)} (
                                {omdb.imdbVotes?.toLocaleString() ?? 0})
                            </Text>
                        ) : null}
                    </View>

                    <TouchableOpacity
                        onPress={handleDelete}
                        style={{ padding: 6, marginLeft: 8, alignSelf: 'flex-start' }}
                        accessibilityLabel="Delete tag">
                        {deleteMutation.isPending ? (
                            <ActivityIndicator />
                        ) : (
                            <Ionicons name="trash-outline" size={18} color="#E53E3E" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Error modal */}
            <Modal
                visible={showErrorModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowErrorModal(false)}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <View
                        style={{
                            width: '80%',
                            backgroundColor: '#fff',
                            padding: 16,
                            borderRadius: 10,
                        }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>
                            Delete failed
                        </Text>
                        <Text style={{ color: '#333', marginBottom: 16 }}>
                            {errorMsg ?? 'Unknown error'}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Pressable
                                onPress={() => setShowErrorModal(false)}
                                style={({ pressed }) => ({
                                    padding: 8,
                                    opacity: pressed ? 0.6 : 1,
                                })}>
                                <Text style={{ color: '#0A84FF', fontWeight: '600' }}>OK</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
