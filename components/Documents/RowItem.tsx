// RowItem.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { applyPrefixSuffix } from '~/utilities/documentHelpers';
type RowItemProps = {
    item: any;
    updateItem: (id: string, patch: Partial<any>) => void;
};

export default function RowItem({ item, updateItem }: RowItemProps) {
    return (
        <View className="my-1 flex-row items-center rounded-lg border border-gray-200 bg-white p-1.5 shadow-sm">
            <View className="mr-3 items-center justify-center rounded bg-indigo-100 p-2">
                <MaterialCommunityIcons name="file-document" size={22} color="#6d28d9" />
                <Text className="mt-1 text-[11px] text-gray-800">
                    {(item.fileSize / (1024 * 1024)).toFixed(1)} MB
                </Text>
            </View>

            <View className="flex-1">
                <Text className="font-medium text-sm text-gray-800">{item.editedFileName}</Text>

                <View className="mt-2 flex-row items-center">
                    <TextInput
                        value={String(item.episode ?? '')}
                        onChangeText={(t) =>
                            updateItem(item.id, { episode: t === '' ? undefined : Number(t) })
                        }
                        placeholder="Ep #"
                        keyboardType="number-pad"
                        className="mr-2 w-20 rounded border border-gray-200 px-2 py-1 text-sm"
                    />

                    <View className="mr-3 flex-row items-center">
                        <Text className="mr-2 text-xs text-gray-600">Subbed</Text>
                        <Switch
                            value={!!item.isSubbedLocal}
                            onValueChange={(v) => updateItem(item.id, { isSubbedLocal: v })}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={() =>
                            updateItem(item.id, {
                                editedFileName: applyPrefixSuffix(
                                    item.editedFileName,
                                    '',
                                    process.env.EXPO_PUBLIC_FILE_SUFFIX ?? ''
                                ),
                            })
                        }
                        className="rounded bg-emerald-100 px-2 py-1">
                        <Text className="text-xs text-emerald-700">Quick tag</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                onPress={() => updateItem(item.id, { editedFileName: item.fileName })}
                className="ml-3">
                <Ionicons name="refresh-circle" size={22} color="#9ca3af" />
            </TouchableOpacity>
        </View>
    );
}
