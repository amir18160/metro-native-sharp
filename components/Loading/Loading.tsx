import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export function Loading() {
    return (
        <View className="my-9 flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
            <Text className="mt-2 text-gray-600">Loading...</Text>
        </View>
    );
}
