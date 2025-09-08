// RenameControls.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

type RenameControlsProps = {
    findText: string;
    setFindText: (v: string) => void;
    replaceText: string;
    setReplaceText: (v: string) => void;
    prefix: string;
    setPrefix: (v: string) => void;
    suffix: string;
    setSuffix: (v: string) => void;
    applyFindReplace: () => void;
    applyRemoveCommon: () => void;
    applyPrefixSuffixAll: () => void;
    commonPart: string;
};

export default function RenameControls({
    findText,
    setFindText,
    replaceText,
    setReplaceText,
    prefix,
    setPrefix,
    suffix,
    setSuffix,
    applyFindReplace,
    applyRemoveCommon,
    applyPrefixSuffixAll,
    commonPart,
}: RenameControlsProps) {
    return (
        <View className="mb-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <Text className="font-medium text-sm text-gray-700">Batch rename</Text>
            <View className="mt-2 flex-row">
                <TextInput
                    value={findText}
                    onChangeText={setFindText}
                    placeholder="Find"
                    className="mr-2 flex-1 rounded border border-gray-200 px-3 py-2"
                />
                <TextInput
                    value={replaceText}
                    onChangeText={setReplaceText}
                    placeholder="Replace"
                    className="flex-1 rounded border border-gray-200 px-3 py-2"
                />
            </View>

            <View className="mt-3 flex-row items-center">
                <TextInput
                    value={prefix}
                    onChangeText={setPrefix}
                    placeholder="Prefix"
                    className="mr-2 flex-1 rounded border border-gray-200 px-3 py-2"
                />
                <TextInput
                    value={suffix}
                    onChangeText={setSuffix}
                    placeholder="Suffix (before extension)"
                    className="flex-1 rounded border border-gray-200 px-3 py-2"
                />
            </View>

            <View className="mt-2 flex-row justify-between">
                <TouchableOpacity
                    onPress={applyFindReplace}
                    className="mr-2 rounded bg-indigo-100 px-3 py-2">
                    <Text className="text-sm text-indigo-700">Find/Replace</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={applyRemoveCommon}
                    className="mr-2 rounded bg-rose-100 px-3 py-2">
                    <Text className="text-sm text-rose-700">Remove common</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={applyPrefixSuffixAll}
                    className="rounded bg-emerald-100 px-3 py-2">
                    <Text className="text-sm text-emerald-700">prefix/suffix</Text>
                </TouchableOpacity>
            </View>

            {commonPart ? (
                <Text className="mt-2 text-xs text-gray-500">
                    Detected common part: {commonPart}
                </Text>
            ) : (
                <Text className="mt-2 text-xs text-gray-400">No common substring detected</Text>
            )}
        </View>
    );
}
