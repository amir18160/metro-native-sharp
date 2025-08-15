import { View, ScrollView } from 'react-native';
import { useState } from 'react';
import TaskFilterModal from '~/components/Tasks/TaskFilterModal';
import { AnimatedButton } from '~/components/common/AnimatedButton';
import TasksList from '~/components/Tasks/TasksList';
import { ITaskFilters } from '~/services/remote/taskService';

export default function TaskListPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState<ITaskFilters | undefined>();

    console.log(filters);

    return (
        <ScrollView>
            <View className="flex-1">
                <View>
                    <View className="mx-auto mt-9 w-full max-w-[95%]">
                        <AnimatedButton title="Filter" onPress={() => setIsModalOpen(true)} />
                    </View>
                    <TaskFilterModal
                        filters={filters}
                        onApply={setFilters}
                        onClose={() => setIsModalOpen(false)}
                        visible={isModalOpen}
                    />
                </View>

                <View>
                    <TasksList filters={filters} />
                </View>
            </View>
        </ScrollView>
    );
}
