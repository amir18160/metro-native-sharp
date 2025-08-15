import { View, Text } from 'react-native';
import React from 'react';
import { Button } from '~/components/TestButton';

export default function TasksPage() {
    return (
        <View className="gap-5 p-5">
            <Button title="Add Tasks" />
            <View className="h-28 w-full bg-green-500">
                <Text className="font-normal">Successful Tasks</Text>
            </View>

            <View className="h-28 w-full bg-red-400">
                <Text className="font-normal">Failed Tasks</Text>
            </View>
        </View>
    );
}
