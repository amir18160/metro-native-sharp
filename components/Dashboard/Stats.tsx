import { View, Text, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withDelay,
} from 'react-native-reanimated';
import { useGetStats } from '~/hooks/services/dashboard/useGetStats';
import { Error } from '../Error/Error';
import { Loading } from '../Loading/Loading';
import { NoData } from '../NoData/NoData';

type StatCardProps = {
    label: string;
    value: number;
    index: number;
};

function StatCard({ label, value, index }: StatCardProps) {
    const offset = useSharedValue(50);
    const opacity = useSharedValue(0);

    useEffect(() => {
        offset.value = withDelay(index * 80, withSpring(0));
        opacity.value = withDelay(index * 80, withSpring(1));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: offset.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={animatedStyle}
            className="mb-4 w-[48%] rounded-2xl bg-white p-4 shadow">
            <Text className="text-sm text-gray-600">{label}</Text>
            <Text className="font-semibold text-xl text-gray-900">{value?.toLocaleString()}</Text>
        </Animated.View>
    );
}

export default function Stats() {
    const stats = useGetStats();

    if (stats.isError) {
        return <Error message="failed to get stats" />;
    }

    if (stats.isLoading) {
        return <Loading />;
    }

    if (!stats.data || !stats.data.data) {
        return <NoData />;
    }

    const data = stats.data.data;

    const entries: { label: string; value: number }[] = [
        { label: 'Documents in DB', value: data.totalDocumentsInDatabase },
        { label: 'Docs added (24h)', value: data.totalDocumentsAddedLast24Hours },
        { label: 'Docs added (7d)', value: data.totalDocumentsAddedLastWeek },
        { label: 'Docs added (30d)', value: data.totalDocumentsAddedLastMonth },
        { label: 'Unique Movies', value: data.totalUniqueMoviesInDatabase },
        { label: 'Unique Series', value: data.totalUniqueSeriesInDatabase },
        { label: 'Tasks in Process', value: data.currentTaskInProcess },
        { label: 'Tasks in Queue', value: data.currentTaskInQueue },
        { label: 'Failed Tasks (Total)', value: data.totalFailedTasks },
        { label: 'Failed Tasks (24h)', value: data.totalFailedTasksLast24Hours },
        { label: 'Successful Tasks (Total)', value: data.totalSuccessfulTasks },
        { label: 'Successful Tasks (24h)', value: data.totalSuccessfulTasksLast24Hours },
    ];

    return (
        <View className="flex-1 bg-gray-100 p-4">
            <Text className="mb-4 font-bold text-2xl text-gray-900">📊 Stats</Text>

            <View className="flex flex-row flex-wrap justify-between">
                {entries.map((item, index) => (
                    <StatCard
                        key={item.label}
                        label={item.label}
                        value={item.value}
                        index={index}
                    />
                ))}
            </View>
        </View>
    );
}
