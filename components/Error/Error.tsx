import React from 'react';
import { View, Text } from 'react-native';

export function Error({ message }: { message: string }) {
    return (
        <View className="m-4 rounded-lg border border-red-400 bg-red-100 p-4">
            <Text className="text-center text-base text-red-800">{message}</Text>
        </View>
    );
}
