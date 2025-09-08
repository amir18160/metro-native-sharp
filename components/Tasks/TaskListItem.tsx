import React, { useEffect, useState } from 'react';
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
    const [summaryHeight, setSummaryHeight] = useState(100); // fallback until measured
    const [detailsHeight, setDetailsHeight] = useState(0);

    // Reanimated shared value for height
    const height = useSharedValue(summaryHeight);

    useEffect(() => {
        // Keep the animated height in sync when summaryHeight is measured/changed
        if (!expanded) {
            height.value = withTiming(summaryHeight, { duration: 0 });
        } else {
            height.value = withTiming(summaryHeight + detailsHeight, {
                duration: 0,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [summaryHeight, detailsHeight]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: height.value,
        };
    });

    const toggleExpand = () => {
        const target = expanded ? summaryHeight : summaryHeight + detailsHeight;
        height.value = withTiming(target, {
            duration: 300,
            easing: Easing.out(Easing.ease),
        });
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

    /**
     * -------------------------
     * RENDER
     * -------------------------
     *
     * Approach:
     * - The visible animated container shows the "summary" (Pressable) and the expanded content.
     * - To measure exact heights without clipping, we render two invisible measurement copies:
     *   1) summaryMeasureView (everything up to Download progress)
     *   2) detailsMeasureView (upload rows + error message)
     *   Those measurement views are position: 'absolute' and opacity: 0 so they are not visible or interactive,
     *   but still lay out and report their measured heights via onLayout.
     */

    // Collapsible (visible) content
    const SummaryContent = (
        <>
            <Pressable className="p-4" onPress={toggleExpand}>
                <View className="flex-row items-start justify-between">
                    {/* Left Column */}
                    <View className="mr-2 flex-1">
                        <View className="flex-row items-center">
                            <TaskStateIndicator state={task.state} />
                            <Text
                                className="ml-2 flex-1 font-semibold text-sm text-gray-900"
                                numberOfLines={1}>
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
                                    className="mr-2 rounded-full bg-red-500 px-3 py-1"
                                    onPress={onCancelTask}>
                                    <Text className="font-medium text-xs text-white">Cancel</Text>
                                </Pressable>
                            )}
                            {(task.state === 'Error' || task.state === 'Cancelled') && (
                                <Pressable
                                    className="rounded-full bg-yellow-500 px-3 py-1"
                                    onPress={onRetryTask}>
                                    <Text className="font-medium text-xs text-white">Retry</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </View>

                {/* Progress Section */}
                <View className="mt-3">
                    <View className="mb-2">
                        <View className="mb-1 flex-row justify-between">
                            <Text className="text-xs text-gray-600">Download</Text>
                            <Text className="text-xs text-gray-600">
                                {Math.round(task.downloadProgress * 100)}%{' '}
                                {task.downloadProgress === 1 ? 'Done' : ''} •{' '}
                                {task.downloadSpeed / 1000} kB/s
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
        </>
    );

    // Expanded content (visible only when expanded)
    const ExpandedContent = (
        <View>
            {hasUploads && (
                <View className="px-4 pb-3">
                    <Text className="mb-2 font-medium text-xs text-gray-700">Upload Details:</Text>
                    {task.uploadProgress?.map((upload, index) => (
                        <TaskUploadProgressItem key={index} upload={upload} />
                    ))}
                </View>
            )}

            {task.errorMessage && (
                <Text className="px-4 pb-2 text-xs text-red-500" numberOfLines={2}>
                    Error: {task.errorMessage}
                </Text>
            )}
        </View>
    );

    return (
        <>
            <Animated.View
                className="mb-3 overflow-hidden rounded-xl border border-gray-200 bg-white"
                style={animatedStyle}>
                {/* Visible content */}
                {SummaryContent}

                {/* Render expanded content inside the animated container (so it's clipped when collapsed) */}
                {expanded && ExpandedContent}
            </Animated.View>

            {/* -----------------------
          Measurement Views (invisible/offscreen but still layout)
          These ensure we get the full heights (not affected by clipping).
          ----------------------- */}
            <View
                pointerEvents="none"
                style={{
                    position: 'absolute',
                    opacity: 0,
                    left: 0,
                    right: 0,
                }}>
                {/* Summary measurement (everything up to download progress) */}
                <View
                    onLayout={(e) => {
                        const h = e.nativeEvent.layout.height;
                        if (h && h !== summaryHeight) {
                            setSummaryHeight(h);
                            // If not expanded, update the animated height to match new summary measurement
                            if (!expanded) {
                                height.value = withTiming(h, { duration: 0 });
                            }
                        }
                    }}>
                    {/* Render the same Summary content but non-interactive.
              To avoid duplicating interactivity/side-effects we reuse visual structure without event props */}
                    <View className="p-4">
                        <View className="flex-row items-start justify-between">
                            <View className="mr-2 flex-1">
                                <View className="flex-row items-center">
                                    <TaskStateIndicator state={task.state} />
                                    <Text
                                        className="ml-2 flex-1 font-semibold text-sm text-gray-900"
                                        numberOfLines={1}>
                                        {task.title}
                                    </Text>
                                </View>

                                <View className="mt-1 flex-row items-center">
                                    <Text className="mr-3 text-xs text-gray-500">
                                        {task.taskType}
                                    </Text>
                                    {task.seasonNumber && (
                                        <Text className="mr-2 text-xs text-gray-500">
                                            S{task.seasonNumber}
                                        </Text>
                                    )}
                                    {task.episodeNumber && (
                                        <Text className="text-xs text-gray-500">
                                            E{task.episodeNumber}
                                        </Text>
                                    )}
                                </View>
                            </View>

                            <View className="items-end">
                                <Text className="text-xs text-blue-500">{task.userName}</Text>

                                <View className="flex-row">
                                    {isActive && (
                                        <View className="mr-2 rounded-full bg-red-500 px-3 py-1">
                                            <Text className="font-medium text-xs text-white">
                                                Cancel
                                            </Text>
                                        </View>
                                    )}
                                    {(task.state === 'Error' || task.state === 'Cancelled') && (
                                        <View className="rounded-full bg-yellow-500 px-3 py-1">
                                            <Text className="font-medium text-xs text-white">
                                                Retry
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>

                        <View className="mt-3">
                            <View className="mb-2">
                                <View className="mb-1 flex-row justify-between">
                                    <Text className="text-xs text-gray-600">Download</Text>
                                    <Text className="text-xs text-gray-600">
                                        {Math.round(task.downloadProgress * 100)}%{' '}
                                        {task.downloadProgress === 1 ? 'Done' : ''} •{' '}
                                        {task.downloadSpeed / 1000} kB/s
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
                                    <SimpleProgressBar
                                        progress={(completedUploads / uploadCount) * 100}
                                    />
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                {/* Details measurement (the content that should appear when expanded) */}
                <View
                    onLayout={(e) => {
                        const h = e.nativeEvent.layout.height;
                        if (h && h !== detailsHeight) {
                            setDetailsHeight(h);
                            // if currently expanded, ensure animated container grows to new total
                            if (expanded) {
                                height.value = withTiming(summaryHeight + h, { duration: 0 });
                            }
                        }
                    }}>
                    {/* Render the expanded content (non-interactive) */}
                    <View>
                        {hasUploads && (
                            <View className="px-4 pb-3">
                                <Text className="mb-2 font-medium text-xs text-gray-700">
                                    Upload Details:
                                </Text>
                                {task.uploadProgress?.map((upload, index) => (
                                    // It's fine to render these here for measurement; keep key stable
                                    <TaskUploadProgressItem key={index} upload={upload} />
                                ))}
                            </View>
                        )}

                        {task.errorMessage && (
                            <Text className="px-4 pb-2 text-xs text-red-500" numberOfLines={2}>
                                Error: {task.errorMessage}
                            </Text>
                        )}
                    </View>
                </View>
            </View>
        </>
    );
}
