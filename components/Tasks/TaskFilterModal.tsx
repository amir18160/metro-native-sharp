import { Reducer, useReducer } from 'react';
import { View } from 'react-native';
import Modal from '../common/Modal';
import { AnimatedButton } from '../common/AnimatedButton';
import { TorrentTaskPriority, TorrentTaskType } from '~/types/server/tasks/ITask';
import DateFilterRow from './DateFilterRow';
import AnimatedTextField from '../common/AnimatedTextField';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import FilterByIMDbId from './FilterByIMDbId';
import AnimatedPicker from '../common/AnimatedPicker';
import {
    stringToTorrentTaskPriority,
    stringToTorrentTaskType,
    torrentTaskPriorityToString,
    torrentTaskTypeToString,
} from '~/utilities/enumConverter';
import { ITaskFilters } from '~/services/remote/taskService';

interface IProps {
    visible: boolean;
    onApply: (filters: ITaskFilters) => void;
    onClose: () => void;
    filters: ITaskFilters | undefined;
}

export interface IFilterAction {
    type:
        | 'SET_TITLE'
        | 'SET_TORRENT_HASH'
        | 'SET_IMDB_ID'
        | 'SET_USER_ID'
        | 'SET_TASK_STATE'
        | 'SET_TASK_PRIORITY'
        | 'SET_TASK_TYPE'
        | 'SET_HAS_ERROR'
        | 'SET_CREATED_AT'
        | 'SET_UPDATED_AT'
        | 'RESET';
    payload: any;
}

const initialState: ITaskFilters = {
    title: undefined,
    torrentHash: undefined,
    imdbId: undefined,
    userId: undefined,
    state: undefined,
    priority: undefined,
    taskType: undefined,
    hasError: undefined,
    createdAt: undefined,
    updatedAt: undefined,
};

const reducer: Reducer<ITaskFilters, IFilterAction> = (prevState, action): ITaskFilters => {
    switch (action.type) {
        case 'SET_TITLE':
            return { ...prevState, title: action.payload };
        case 'SET_TORRENT_HASH':
            return { ...prevState, torrentHash: action.payload };
        case 'SET_IMDB_ID':
            return { ...prevState, imdbId: action.payload };
        case 'SET_USER_ID':
            return { ...prevState, userId: action.payload };
        case 'SET_TASK_STATE':
            return { ...prevState, state: action.payload };
        case 'SET_TASK_PRIORITY':
            return { ...prevState, priority: action.payload };
        case 'SET_TASK_TYPE':
            return { ...prevState, taskType: action.payload };
        case 'SET_HAS_ERROR':
            return { ...prevState, hasError: action.payload };
        case 'SET_CREATED_AT':
            return { ...prevState, createdAt: action.payload };
        case 'SET_UPDATED_AT':
            return { ...prevState, updatedAt: action.payload };
        case 'RESET': {
            return { ...initialState };
        }
        default:
            return prevState;
    }
};

export default function TaskFilterModal({ visible, onClose, onApply, filters }: IProps) {
    const [state, dispatch] = useReducer(reducer, filters ?? initialState);

    const onReset = () => {
        dispatch({ type: 'RESET', payload: null });
    };

    const onApplyHandler = () => {
        onApply(state);
        onClose();
    };

    return (
        <Modal onClose={onClose} visible={visible} title="Filter Tasks">
            <>
                <View className="flex-1 p-4">
                    <View className="flex-row gap-2">
                        <View className="flex-1">
                            <AnimatedTextField
                                label="Title"
                                labelColor="text-base text-black dark:text-white"
                                iconLeft={<MaterialIcons name="title" size={24} color="white" />}
                                placeholder="Task title"
                                value={state.title || ''}
                                size="sm"
                                onChangeText={(text) =>
                                    dispatch({ type: 'SET_TITLE', payload: text })
                                }
                            />
                        </View>

                        <View className="flex-1">
                            <AnimatedTextField
                                labelColor="text-base text-black dark:text-white"
                                label="TorrentHash"
                                iconLeft={
                                    <MaterialCommunityIcons name="magnet" size={24} color="white" />
                                }
                                size="sm"
                                placeholder="TorrentHash"
                                value={state.torrentHash || ''}
                                onChangeText={(text) =>
                                    dispatch({ type: 'SET_TORRENT_HASH', payload: text })
                                }
                            />
                        </View>
                    </View>

                    <View className="">
                        <FilterByIMDbId
                            imdbId={state.imdbId}
                            setImdbId={(imdbId) =>
                                dispatch({ type: 'SET_IMDB_ID', payload: imdbId })
                            }
                        />
                    </View>

                    <View className="flex-row gap-2">
                        <View className="mt-5 flex-1">
                            <AnimatedPicker
                                size="sm"
                                labelColor="text-black dark:text-white"
                                label="Priority"
                                selectedValue={
                                    state.priority !== undefined
                                        ? torrentTaskPriorityToString(state.priority)
                                        : 'All'
                                }
                                onSelect={(value) =>
                                    dispatch({
                                        type: 'SET_TASK_PRIORITY',
                                        payload:
                                            value === 'All'
                                                ? undefined
                                                : stringToTorrentTaskPriority(value),
                                    })
                                }
                                options={[
                                    'All',
                                    ...Object.keys(TorrentTaskPriority).filter((k) =>
                                        isNaN(Number(k))
                                    ),
                                ]}
                                variant="filled"
                            />
                        </View>

                        <View className="mt-5 flex-1">
                            <AnimatedPicker
                                size="sm"
                                labelColor="text-black dark:text-white"
                                label="Task Type"
                                selectedValue={
                                    state.taskType !== undefined
                                        ? torrentTaskTypeToString(state.taskType)
                                        : 'All'
                                }
                                onSelect={(value) =>
                                    dispatch({
                                        type: 'SET_TASK_TYPE',
                                        payload:
                                            value === 'All'
                                                ? undefined
                                                : stringToTorrentTaskType(value),
                                    })
                                }
                                options={[
                                    'All',
                                    ...Object.keys(TorrentTaskType).filter((k) => isNaN(Number(k))),
                                ]}
                                variant="filled"
                            />
                        </View>

                        <View className="mt-5">
                            <AnimatedPicker
                                size="sm"
                                labelColor="text-black dark:text-white"
                                label="With Errors"
                                selectedValue={
                                    state.hasError === undefined
                                        ? 'All'
                                        : state.hasError
                                          ? 'Yes'
                                          : 'No'
                                }
                                onSelect={(value) =>
                                    dispatch({
                                        type: 'SET_HAS_ERROR',
                                        payload: value === 'All' ? undefined : value === 'Yes',
                                    })
                                }
                                options={['All', 'Yes', 'No']}
                                variant="filled"
                            />
                        </View>
                    </View>

                    <View className="mt-5 flex-row gap-2">
                        <View className="flex-1">
                            <DateFilterRow
                                field="createdAt"
                                label="Created At"
                                value={state.createdAt}
                                dispatch={dispatch}
                            />
                        </View>

                        <View className="flex-1">
                            <DateFilterRow
                                field="updatedAt"
                                label="Updated At"
                                value={state.updatedAt}
                                dispatch={dispatch}
                            />
                        </View>
                    </View>

                    <View className="mt-6 flex-row items-center justify-between gap-3">
                        <AnimatedButton
                            variant="danger"
                            onPress={onReset}
                            title="Reset"
                            size="md"
                            className="flex-1"
                        />

                        <AnimatedButton
                            onPress={onApplyHandler}
                            title="Apply Filters"
                            containerClass="flex-1"
                            className="flex-1"
                        />
                    </View>
                </View>
            </>
        </Modal>
    );
}
