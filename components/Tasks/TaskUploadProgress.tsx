import { View, Text } from 'react-native';
import { IUploadProgress } from '~/types/server/tasks/ITask';
import SimpleProgressBar from '../common/SimpleProgressBar';

interface IProps {
    upload: IUploadProgress;
}

export default function TaskUploadProgressItem({ upload }: IProps) {
    return (
        <View className="flex-row items-center py-1">
            <Text className="mr-2 flex-1 text-xs text-gray-600" numberOfLines={1}>
                {upload.fileName}
            </Text>
            <Text className="w-12 text-right text-xs text-gray-500">
                {Math.round(upload.progress)}%
            </Text>
            <View className="ml-2 w-16">
                <SimpleProgressBar progress={upload.progress} />
            </View>
        </View>
    );
}
