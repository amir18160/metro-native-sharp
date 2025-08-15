import { View } from 'react-native';
import React from 'react';
import AnimatedPicker from '../common/AnimatedPicker';
import { TorrentTaskType, TorrentTaskPriority } from '~/types/server/tasks/ITask';
import {
    torrentTaskTypeToString,
    stringToTorrentTaskType,
    torrentTaskPriorityToString,
    stringToTorrentTaskPriority,
} from '~/utilities/enumConverter';
import { useAddTaskStore } from '~/stores/useAddTaskStore';

export default function TaskPickers() {
    const store = useAddTaskStore();
    const taskTypeOptions = Object.keys(TorrentTaskType).filter((k) => isNaN(Number(k)));
    const priorityOptions = Object.keys(TorrentTaskPriority).filter((k) => isNaN(Number(k)));

    return (
        <View className="mt-8 flex-row gap-3">
            <View className="flex-1">
                <AnimatedPicker
                    label="Task Type"
                    selectedValue={torrentTaskTypeToString(store.taskType)}
                    onSelect={(value) =>
                        store.setTaskType(stringToTorrentTaskType(value) as TorrentTaskType)
                    }
                    options={taskTypeOptions}
                />
            </View>
            <View className="flex-1">
                <AnimatedPicker
                    label="Priority"
                    selectedValue={torrentTaskPriorityToString(store.priority)}
                    onSelect={(value) => {
                        store.setPriority(
                            stringToTorrentTaskPriority(value) as TorrentTaskPriority
                        );
                    }}
                    options={priorityOptions}
                />
            </View>
        </View>
    );
}
