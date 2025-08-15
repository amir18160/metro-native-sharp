import React from 'react';
import { View, Text } from 'react-native';
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
    if (percent < 50) return '#22c55e';
    if (percent < 80) return '#facc15';
    return '#dc2626';
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
                <Text className="font-medium text-sm text-white">
                    {drive.name} ({drive.driveFormat})
                </Text>
                <Text className="text-sm text-white">
                    {drive.usedSpaceGb.toFixed(1)} GB / {drive.totalSizeGb.toFixed(1)} GB
                </Text>
            </View>
            <View className="mt-1 h-2 rounded-full bg-gray-700">
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
        <View className="flex-col rounded-3xl bg-indigo-900 p-4">
            <View className="mb-5  justify-between">
                <View className="mb-4 justify-between">
                    <View>
                        <Text className="mb-1 text-xs text-indigo-300">OS</Text>
                        <Text className="text-sm text-white" numberOfLines={1}>
                            {systemInfo.osDescription}
                        </Text>
                    </View>
                    <View>
                        <Text className="mb-1 text-xs text-indigo-300">Framework</Text>
                        <Text className="text-sm text-white">
                            {systemInfo.frameworkDescription}
                        </Text>
                    </View>
                </View>

                <View className="flex-row">
                    <View className="items-center">
                        <CircularProgress
                            value={systemInfo.cpuUsagePercentage}
                            radius={36}
                            maxValue={100}
                            title="CPU"
                            titleStyle={{ fontSize: 12, color: '#a5b4fc' }}
                            valueSuffix="%"
                            activeStrokeColor={getProgressColor(systemInfo.cpuUsagePercentage)}
                            inActiveStrokeColor="#3f3f46"
                            progressValueStyle={{
                                fontSize: 14,
                                fontWeight: 'bold',
                                color: 'white',
                            }}
                            duration={1000}
                        />
                        <Text className="mt-1 text-xs text-indigo-200">
                            {systemInfo.cpuCoreCount} cores
                        </Text>
                    </View>

                    <View className="items-center">
                        <CircularProgress
                            value={systemInfo.ramUsagePercentage}
                            radius={36}
                            maxValue={100}
                            title="RAM"
                            titleStyle={{ fontSize: 12, color: '#a5b4fc' }}
                            valueSuffix="%"
                            activeStrokeColor={getProgressColor(systemInfo.ramUsagePercentage)}
                            inActiveStrokeColor="#3f3f46"
                            progressValueStyle={{
                                fontSize: 14,
                                fontWeight: 'bold',
                                color: 'white',
                            }}
                            duration={1000}
                        />
                        <Text className="mt-1 text-xs text-indigo-200">
                            {(systemInfo.usedRamMb / 1024).toFixed(1)} GB /{' '}
                            {(systemInfo.totalRamMb / 1024).toFixed(1)} GB
                        </Text>
                    </View>
                </View>
            </View>

            <View className="justify-evenly">
                {systemInfo.drives.map((drive) => (
                    <DriveBar key={drive.name} drive={drive} />
                ))}
            </View>
        </View>
    );
}
