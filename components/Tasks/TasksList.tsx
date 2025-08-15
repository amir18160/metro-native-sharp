import { FlatList } from 'react-native';
import { useInfiniteQueryTasks } from '~/hooks/services/tasks/useInfiniteQueryTasks';
import { Error } from '../Error/Error';
import { Loading } from '../Loading/Loading';
import { NoData } from '../NoData/NoData';

import { ITaskFilters } from '~/services/remote/taskService';
import TaskListItem from './TaskListItem';

interface IProps {
    filters?: ITaskFilters;
}

export default function TasksList({ filters }: IProps) {
    const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQueryTasks(filters ?? {});

    if (isError) {
        return <Error message="Failed to load tasks" />;
    }

    if (isLoading) {
        return <Loading />;
    }

    const tasks =
        data?.pages.flatMap((page) =>
            page.status === 'success' && page.data ? page.data.items : []
        ) || [];

    if (tasks.length === 0) {
        return <NoData />;
    }

    return (
        <FlatList
            data={tasks}
            renderItem={({ item }) => <TaskListItem task={item} />}
            keyExtractor={(item) => item.id}
            onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isFetchingNextPage ? <Loading /> : null}
            contentContainerStyle={{ paddingBottom: 20 }}
        />
    );
}
