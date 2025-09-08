// FooterActions.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type FooterActionsProps = {
    onClose?: () => void;
    onSubmit: () => void;
};

export default function FooterActions({ onClose, onSubmit }: FooterActionsProps) {
    return (
        <View className="mt-3 flex-row">
            <TouchableOpacity
                onPress={() => {
                    if (onClose) onClose();
                }}
                className="mr-2 flex-1 rounded bg-gray-200 px-4 py-3">
                <Text className="text-center text-sm">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSubmit} className="flex-1 rounded bg-blue-500 px-4 py-3">
                <Text className="text-center font-semibold text-white">Submit</Text>
            </TouchableOpacity>
        </View>
    );
}
