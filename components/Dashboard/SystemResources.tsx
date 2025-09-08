import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
} from 'react-native-reanimated';
import CircularProgress from 'react-native-circular-progress-indicator';
import { useGetSystemResources } from '~/hooks/services/dashboard/useGetSystemResources';
import { IDriveInfo } from '~/types/server/dashboard/resources';

const getProgressColor = (percent: number): string => {
    'worklet';
    if (percent < 50) return '#22c55e'; // green
    if (percent < 80) return '#eab308'; // amber
    return '#dc2626'; // red
};

const DriveBar = ({ drive }: { drive: IDriveInfo }) => {
    const progress = useSharedValue(0);

    React.useEffect(() => {
        progress.value = withDelay(300, withTiming(drive.usagePercentage, { duration: 800 }));
    }, [drive, progress]);

    const animatedStyle = useAnimatedStyle(() => ({
        width: `${progress.value}%`,
        backgroundColor: getProgressColor(progress.value),
    }));

    return (
        <View className="mb-3">
            <View className="flex-row justify-between">
                <Text className="font-medium text-sm text-gray-800">
                    {drive.name} ({drive.driveFormat})
                </Text>
                <Text className="text-sm text-gray-600">
                    {drive.usedSpaceGb.toFixed(1)} GB / {drive.totalSizeGb.toFixed(1)} GB
                </Text>
            </View>
            <View className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                <Animated.View className="h-2 rounded-full" style={animatedStyle} />
            </View>
        </View>
    );
};

export default function SystemInfoDisplay() {
    const systemResources = useGetSystemResources();
    const systemInfo = systemResources.data?.data;

    if (!systemInfo) return null;

    return (
        <View className="flex-1 bg-gray-100 p-4">
            <Text className="mb-4 font-bold text-2xl text-gray-900">⚙️ System Info</Text>

            {/* OS & Framework */}
            <View className="mb-6">
                <View className="mb-3">
                    <Text className="mb-1 text-xs text-gray-500">OS</Text>
                    <Text className="text-sm text-gray-800" numberOfLines={1}>
                        {systemInfo.osDescription}
                    </Text>
                </View>
                <View>
                    <Text className="mb-1 text-xs text-gray-500">Framework</Text>
                    <Text className="text-sm text-gray-800">{systemInfo.frameworkDescription}</Text>
                </View>
            </View>

            {/* CPU & RAM */}
            <View className="mb-6 flex-row justify-between">
                <View className="w-[48%] items-center rounded-2xl bg-white p-4 shadow">
                    <CircularProgress
                        value={systemInfo.cpuUsagePercentage}
                        radius={36}
                        maxValue={100}
                        title="CPU"
                        titleStyle={{ fontSize: 12, color: '#6b7280' }}
                        valueSuffix="%"
                        activeStrokeColor={getProgressColor(systemInfo.cpuUsagePercentage)}
                        inActiveStrokeColor="#e5e7eb"
                        progressValueStyle={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#111827',
                        }}
                        duration={1000}
                    />
                    <Text className="mt-2 text-xs text-gray-600">
                        {systemInfo.cpuCoreCount} cores
                    </Text>
                </View>

                <View className="w-[48%] items-center rounded-2xl bg-white p-4 shadow">
                    <CircularProgress
                        value={systemInfo.ramUsagePercentage}
                        radius={36}
                        maxValue={100}
                        title="RAM"
                        titleStyle={{ fontSize: 12, color: '#6b7280' }}
                        valueSuffix="%"
                        activeStrokeColor={getProgressColor(systemInfo.ramUsagePercentage)}
                        inActiveStrokeColor="#e5e7eb"
                        progressValueStyle={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#111827',
                        }}
                        duration={1000}
                    />
                    <Text className="mt-2 text-xs text-gray-600">
                        {(systemInfo.usedRamMb / 1024).toFixed(1)} GB /{' '}
                        {(systemInfo.totalRamMb / 1024).toFixed(1)} GB
                    </Text>
                </View>
            </View>

            {/* Drives */}
            <View>
                {systemInfo.drives.map((drive) => (
                    <DriveBar key={drive.name} drive={drive} />
                ))}
            </View>
        </View>
    );
}
