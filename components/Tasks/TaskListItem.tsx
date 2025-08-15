import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withTiming,
    useSharedValue,
    Easing,
} from 'react-native-reanimated';
import { ITask } from '~/types/server/tasks/ITask';
import TaskStateIndicator from './TaskStateIndicator';
import TaskUploadProgressItem from './TaskUploadProgress';
import SimpleProgressBar from '../common/SimpleProgressBar';
import { useCancelTorrentTask } from '~/hooks/services/tasks/useCancelTorrentTask';
import { useRetryTorrentTask } from '~/hooks/services/tasks/useRetryTorrentTask';
import { modal } from '~/stores/useAnimatedModalCenterStore';

interface IProps {
    task: ITask;
}

export default function TaskListItem({ task }: IProps) {
    const cancelTask = useCancelTorrentTask();
    const retryTask = useRetryTorrentTask();

    const [expanded, setExpanded] = useState(false);
    const height = useSharedValue(80);

    const animatedStyle = useAnimatedStyle(() => ({
        height: withTiming(height.value, {
            duration: 300,
            easing: Easing.out(Easing.ease),
        }),
    }));

    const toggleExpand = () => {
        height.value = expanded
            ? 80
            : expanded
              ? 80
              : 120 + (task.uploadProgress?.length || 0) * 30;
        setExpanded(!expanded);
    };

    const onRetryTask = () => {
        modal.confirm({
            onCancel: () => {},
            onConfirm: () => {
                modal.hide();
                modal.loading({
                    message: 'Retry Task...',
                });
                retryTask.mutate(task.id, {
                    onSuccess: () => {
                        modal.hide();
                        modal.success({ message: 'Task retried successfully.' });
                    },
                    onError: (error) => {
                        modal.hide();
                        modal.error({
                            message: `failed to retry task. message ${error.message ?? 'unknown'}`,
                        });
                    },
                });
            },
        });
    };

    const onCancelTask = () => {
        modal.confirm({
            onCancel: () => {},
            onConfirm: () => {
                modal.hide();
                modal.loading({
                    message: 'Canceling Task...',
                });
                cancelTask.mutate(task.id, {
                    onSuccess: () => {
                        modal.hide();
                        modal.success({ message: 'Task canceled successfully.' });
                    },
                    onError: (error) => {
                        modal.hide();
                        modal.error({
                            message: `failed to cancel task. please contact server's admin. message ${error.message ?? 'unknown'}`,
                        });
                    },
                });
            },
        });
    };

    const isActive = !['Completed', 'Cancelled', 'Error'].includes(task.state);
    const hasUploads = task.uploadProgress && task.uploadProgress.length > 0;
    const uploadCount = task.uploadProgress?.length || 0;
    const completedUploads = task.uploadProgress?.filter((u) => u.progress >= 100).length || 0;

    return (
        <Animated.View className="overflow-hidden border-b border-gray-200" style={animatedStyle}>
            <Pressable className="p-3" onPress={toggleExpand}>
                <View className="flex-row items-start justify-between">
                    {/* Left Column */}
                    <View className="mr-2 flex-1">
                        <View className="flex-row items-center">
                            <TaskStateIndicator state={task.state} />
                            <Text className="ml-2 flex-1 font-medium text-sm" numberOfLines={1}>
                                {task.title}
                            </Text>
                        </View>

                        <View className="mt-1 flex-row items-center">
                            <Text className="mr-3 text-xs text-gray-500">{task.taskType}</Text>
                            {task.seasonNumber && (
                                <Text className="mr-2 text-xs text-gray-500">
                                    S{task.seasonNumber}
                                </Text>
                            )}
                            {task.episodeNumber && (
                                <Text className="text-xs text-gray-500">E{task.episodeNumber}</Text>
                            )}
                        </View>
                    </View>

                    {/* Right Column */}
                    <View className="items-end">
                        <Pressable
                            onPress={() => console.log('User pressed:', task.userId)}
                            className="mb-1">
                            <Text className="text-xs text-blue-500">{task.userName}</Text>
                        </Pressable>

                        <View className="flex-row">
                            {isActive && (
                                <Pressable
                                    className="mr-2 rounded bg-red-500 px-2 py-1"
                                    onPress={onCancelTask}>
                                    <Text className="text-xs text-white">Cancel</Text>
                                </Pressable>
                            )}
                            {(task.state === 'Error' || task.state === 'Cancelled') && (
                                <Pressable
                                    className="rounded bg-yellow-500 px-2 py-1"
                                    onPress={onRetryTask}>
                                    <Text className="text-xs text-white">Retry</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </View>

                {/* Progress Section */}
                <View className="mt-2">
                    <View className="mb-1">
                        <View className="mb-1 flex-row justify-between">
                            <Text className="text-xs text-gray-600">Download</Text>
                            <Text className="text-xs text-gray-600">
                                {Math.round(task.downloadProgress * 100)}%{' '}
                                {task.downloadProgress === 1 ? 'Done' : ''} •{' '}
                                {task.downloadSpeed / 1000}
                                kB/s
                            </Text>
                        </View>
                        <SimpleProgressBar progress={task.downloadProgress * 100} />
                    </View>

                    {hasUploads && (
                        <View>
                            <View className="mb-1 flex-row items-center justify-between">
                                <Text className="text-xs text-gray-600">Upload</Text>
                                <Text className="text-xs text-gray-600">
                                    {completedUploads}/{uploadCount} files
                                </Text>
                            </View>
                            <SimpleProgressBar progress={(completedUploads / uploadCount) * 100} />
                        </View>
                    )}
                </View>
            </Pressable>

            {/* Expanded Upload Details */}
            {expanded && hasUploads && (
                <View className="px-3 pb-3">
                    <Text className="mb-1 font-medium text-xs text-gray-700">Upload Details:</Text>
                    {task.uploadProgress?.map((upload, index) => (
                        <TaskUploadProgressItem key={index} upload={upload} />
                    ))}
                </View>
            )}

            {/* Error Message */}
            {task.errorMessage && (
                <Text className="px-3 pb-2 text-xs text-red-500" numberOfLines={2}>
                    Error: {task.errorMessage}
                </Text>
            )}
        </Animated.View>
    );
}
