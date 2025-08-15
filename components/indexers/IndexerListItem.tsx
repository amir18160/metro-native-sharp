// components/IndexerListItem.js
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
// You might need to install an icon library like react-native-vector-icons
// import Icon from 'react-native-vector-icons/Ionicons';
interface IndexerListItemProps {
    item: {
        name: string;
        implementationName: string;
        language: string;
    };
    onPress: () => void;
}

export default function IndexerListItem({ item, onPress }: IndexerListItemProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm active:bg-gray-100">
            <View className="flex-1">
                <Text className="mb-1 font-bold text-base text-black">{item.name}</Text>
                <Text className="text-sm text-gray-600">
                    {item.implementationName} ({item.language})
                </Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={22} color="#6B7280" />
            <Text className="text-lg text-gray-400">›</Text>
        </TouchableOpacity>
    );
}
