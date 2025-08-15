import React from 'react';
import { View, Text } from 'react-native';

export function NoData() {
    return (
        <View className="flex-1 items-center justify-center">
            <Text className="mt-2 text-gray-600">No Data Found</Text>
        </View>
    );
}
