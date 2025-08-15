import React from 'react';
import { View, Modal, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { IIndexer } from '~/types/server/indexers/IIndexer';

const DetailRow = ({ label, value }: { label: string; value: any }) => (
    <View className="mb-3 flex-row border-b border-gray-100 pb-3">
        <Text className="w-2/5 font-semibold text-gray-500">{label}</Text>
        <Text className="flex-1 text-black">{String(value ?? '—')}</Text>
    </View>
);

interface IndexerDetailModalProps {
    item: IIndexer;
    visible: boolean;
    onClose: () => void;
}

export default function IndexerDetailModal({ item, visible, onClose }: IndexerDetailModalProps) {
    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <Pressable onPress={onClose} className="flex-1 items-center justify-end bg-black/50">
                <Pressable className="h-[85%] w-full rounded-t-2xl bg-white shadow-xl">
                    <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
                        <Text className="flex-1 font-bold text-xl text-black">{item.name}</Text>
                        <TouchableOpacity
                            onPress={onClose}
                            className="rounded-full bg-gray-100 p-2 active:bg-gray-200">
                            <Text className="font-bold text-gray-600">✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* All Details */}
                    <ScrollView contentContainerStyle={{ padding: 16 }}>
                        <DetailRow label="ID" value={item.id} />
                        <DetailRow label="Implementation" value={item.implementation} />
                        <DetailRow label="Implementation Name" value={item.implementationName} />
                        <DetailRow label="Config Contract" value={item.configContract} />
                        <DetailRow label="Info Link" value={item.infoLink} />
                        <DetailRow label="Tags" value={item.tags?.join(', ')} />
                        <DetailRow label="Presets" value={item.presets?.join(', ')} />
                        <DetailRow label="Indexer URLs" value={item.indexerUrls?.join(', ')} />
                        <DetailRow label="Legacy URLs" value={item.legacyUrls.join(', ')} />
                        <DetailRow label="Definition Name" value={item.definitionName} />
                        <DetailRow label="Description" value={item.description} />
                        <DetailRow label="Language" value={item.language} />
                        <DetailRow label="Encoding" value={item.encoding} />
                        <DetailRow label="Enabled" value={item.enable} />
                        <DetailRow label="Redirect" value={item.redirect} />
                        <DetailRow label="Supports RSS" value={item.supportsRss} />
                        <DetailRow label="Supports Search" value={item.supportsSearch} />
                        <DetailRow label="Supports Redirect" value={item.supportsRedirect} />
                        <DetailRow label="Supports Pagination" value={item.supportsPagination} />
                        <DetailRow label="App Profile ID" value={item.appProfileId} />
                        <DetailRow label="Protocol" value={item.protocol} />
                        <DetailRow label="Privacy" value={item.privacy} />
                        <DetailRow label="Priority" value={item.priority} />
                        <DetailRow label="Download Client ID" value={item.downloadClientId} />
                        <DetailRow label="Added" value={item.added} />
                        <DetailRow label="Sort Name" value={item.sortName} />
                        {/* Add any other fields you need here */}
                    </ScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
