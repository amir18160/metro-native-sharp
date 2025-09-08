import { View } from 'react-native';
import { Text } from '../nativewindui/Text';

interface IProps {
    state: string;
}

export default function TaskStateIndicator({ state }: IProps) {
    const stateColors: Record<string, string> = {
        Pending: 'bg-gray-500',
        JobQueue: 'bg-blue-300',
        JobStarted: 'bg-blue-500',
        InGettingOmdbDetailsProcess: 'bg-purple-500',
        InQbitButDownloadNotStarted: 'bg-yellow-500',
        TorrentTimedOut: 'bg-orange-500',
        InQbitAndDownloadStarted: 'bg-yellow-600',
        TorrentWasDownloaded: 'bg-green-400',
        InExtractingSubtitle: 'bg-indigo-500',
        InParingSubtitlesWithVideo: 'bg-indigo-600',
        InFfmpegButProcessNotStarted: 'bg-pink-500',
        InFfmpegAndProcessStarted: 'bg-pink-600',
        InUploaderButUploadingNotStarted: 'bg-teal-500',
        InUploaderAndUploadingStarted: 'bg-teal-600',
        Completed: 'bg-green-600',
        Error: 'bg-red-500',
        Cancelling: 'bg-orange-300',
        Cancelled: 'bg-orange-500',
    };

    return (
        <View className="flex-row items-center gap-2">
            <View className={`h-2 w-2 rounded-full ${stateColors[state] || 'bg-gray-400'}`} />
            <Text>{state}</Text>
        </View>
    );
}
