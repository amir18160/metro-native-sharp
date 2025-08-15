import { useEffect, useState } from 'react';
import { Text, Pressable, ScrollView, ActivityIndicator, View } from 'react-native';

import { useAddTaskStore } from '~/stores/useAddTaskStore';
import { useAddTorrentTask } from '~/hooks/services/tasks/useAddTorrentTask';
import SelectMedia from '~/components/Tasks/SelectMedia';
import SelectSubtitle from '~/components/Tasks/SelectSubtitle';
import MagnetField from '~/components/Tasks/MagnetField';
import ImdbField from '~/components/Tasks/ImdbField';
import TaskPickers from '~/components/Tasks/TaskPickers';
import { modal } from '~/stores/useAnimatedModalCenterStore';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { TorrentTaskPriority, TorrentTaskType } from '~/types/server/tasks/ITask';
import { useLocalSearchParams } from 'expo-router';
import { Toast } from 'toastify-react-native';

type AddTaskFormErrorKey = 'title' | 'magnet' | 'imdbId' | 'seasonNumber' | 'episodeNumber';

type AddTaskFormErrors = Partial<Record<AddTaskFormErrorKey, string>>;

const SubmitButton = ({ onPress, isPending }: { onPress: () => void; isPending: boolean }) => (
    <Pressable
        className="mt-4 items-center rounded-lg bg-blue-600 p-4 active:bg-blue-700 disabled:bg-gray-600 disabled:opacity-70"
        onPress={onPress}
        disabled={isPending}>
        {isPending ? (
            <ActivityIndicator color="#fff" />
        ) : (
            <Text className="font-bold text-lg text-white">Add Task</Text>
        )}
    </Pressable>
);

const AddTaskForm = () => {
    const { mutate, isPending } = useAddTorrentTask();
    const store = useAddTaskStore();
    const [errors, setErrors] = useState<AddTaskFormErrors>({});

    const { magnet, imdbId } = useLocalSearchParams<{ magnet: string; imdbId: string }>();

    useEffect(() => {
        if (magnet) {
            store.setMagnet(magnet);
            Toast.show({ type: 'success', text1: 'Success', text2: 'Magnet URI has been set.' });
        }
        if (imdbId) {
            store.setImdbId(imdbId);
        }
    }, [magnet, imdbId]);

    const validate = (): AddTaskFormErrors => {
        const e: AddTaskFormErrors = {};

        if (!store.magnet?.trim()) e.magnet = 'Magnet URI is required.';
        else if (!store.magnet.startsWith('magnet:')) e.magnet = "Magnet must start with 'magnet:'";

        if (!store.imdbId?.trim()) e.imdbId = 'IMDb ID is required.';
        else if (store.imdbId.length < 3 || store.imdbId.length > 20)
            e.imdbId = 'IMDb ID must be 3-20 characters.';

        return e;
    };

    const handleSubmit = () => {
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        modal.confirm({
            title: 'Confirm Task Addition',
            message: 'Are you sure you want to add this task?',
            confirmText: 'Yes, Add Task',
            cancelText: 'No, Cancel',
            additionalJSX: renderConfirmationJSX({
                imdbId: store.imdbId!,
                priority: store.priority,
                taskType: store.taskType,
                title: store.media!.title,
            }),
            onConfirm: () => {
                modal.loading({ message: 'Adding task...' });
                mutate(
                    {
                        title: store.media!.title,
                        magnet: store.magnet!,
                        imdbId: store.imdbId!,
                        taskType: store.taskType,
                        priority: store.priority,
                        subtitleStoredPath: store.subtitleStoredPath ?? undefined,
                        seasonNumber: store.seasonNumber ?? undefined,
                        episodeNumber: store.episodeNumber ?? undefined,
                    },
                    {
                        onError: (err) => {
                            const message =
                                err instanceof Error ? err.message : 'Something went wrong';
                            modal.hide();
                            modal.error({ message });
                        },
                        onSuccess: () => {
                            modal.hide();
                            modal.success({ message: 'Task added successfully' });
                            store.reset();
                            setErrors({});
                        },
                    }
                );
            },
            onCancel: () => {
                // Optional: Do nothing or show a message
            },
        });
    };

    return (
        <ScrollView
            nestedScrollEnabled
            className="flex-1 bg-gray-900"
            contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
            <Text className="mb-6 text-center font-bold text-2xl text-gray-50">
                Add New Torrent Task
            </Text>

            <SelectMedia />

            <SelectSubtitle />

            <MagnetField error={errors.magnet} />

            <ImdbField error={errors.imdbId} />

            <TaskPickers />

            <SubmitButton onPress={handleSubmit} isPending={isPending} />
        </ScrollView>
    );
};

interface ConfirmationJSXProps {
    priority: TorrentTaskPriority;
    taskType: TorrentTaskType;
    title: string;
    imdbId: string;
}
const renderConfirmationJSX = ({ imdbId, priority, taskType, title }: ConfirmationJSXProps) => (
    <View className="mb-5 w-full rounded-xl bg-white/90 p-4 shadow-md">
        <View className="flex-row justify-between">
            <View className="mr-2 flex-1 flex-row items-center">
                <MaterialIcons name="movie" size={20} color="#1f2937" />
                <View className="ml-2">
                    <Text className="text-xs text-gray-500">Title</Text>
                    <Text className="font-semibold text-base text-gray-800">{title || 'N/A'}</Text>
                </View>
            </View>

            <View className="ml-2 flex-1 flex-row items-center">
                <FontAwesome5 name="imdb" size={20} color="#f5c518" />
                <View className="ml-2">
                    <Text className="text-xs text-gray-500">IMDb ID</Text>
                    <Text className="text-base text-gray-800">{imdbId || 'N/A'}</Text>
                </View>
            </View>
        </View>

        <View className="mb-4 flex-row justify-between">
            <View className="mr-2 flex-1 flex-row items-center">
                <MaterialIcons name="category" size={20} color="#1f2937" />
                <View className="ml-2">
                    <Text className="text-xs text-gray-500">Type</Text>
                    <Text className="text-base capitalize text-gray-800">{taskType || 'N/A'}</Text>
                </View>
            </View>

            <View className="ml-2 flex-1 flex-row items-center">
                <MaterialIcons name="priority-high" size={20} color="#dc2626" />
                <View className="ml-2">
                    <Text className="text-xs text-gray-500">Priority</Text>
                    <Text className="text-base capitalize text-gray-800">{priority || 'N/A'}</Text>
                </View>
            </View>
        </View>
    </View>
);

export default AddTaskForm;
