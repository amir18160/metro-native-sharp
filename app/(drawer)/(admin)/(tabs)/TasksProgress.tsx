import { View } from 'react-native';
import { useState } from 'react';
import TaskFilterModal from '~/components/Tasks/TaskFilterModal';
import { AnimatedButton } from '~/components/common/AnimatedButton';
import TasksList from '~/components/Tasks/TasksList';
import { ITaskFilters } from '~/services/remote/taskService';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TasksProgress() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState<ITaskFilters | undefined>();
    const router = useRouter();

    return (
        <View className="flex-1">
            {/* Static header */}
            <View className="mx-auto mt-9 w-full max-w-[95%] flex-row items-center justify-between gap-2 px-2">
                <View className="flex-1">
                    <AnimatedButton
                        title="Filter"
                        onPress={() => setIsModalOpen(true)}
                        leftIcon={<MaterialIcons name="filter-list" size={20} color="#fff" />}
                    />
                </View>
                <View className="flex-1">
                    <AnimatedButton
                        title="Add Task"
                        onPress={() => router.push('/(tasks)/AddTaskForm')}
                        variant="secondary"
                        leftIcon={<MaterialIcons name="add" size={20} color="#fff" />}
                    />
                </View>
            </View>

            <TaskFilterModal
                filters={filters}
                onApply={setFilters}
                onClose={() => setIsModalOpen(false)}
                visible={isModalOpen}
            />

            {/* Scrollable list */}
            <View className="mt-2 flex-1 px-2">
                <TasksList filters={filters} />
            </View>
        </View>
    );
}
