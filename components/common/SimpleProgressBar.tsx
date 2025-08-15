import { View } from 'react-native';
import Animated from 'react-native-reanimated';

interface IProps {
    progress: number;
}
export default function SimpleProgressBar({ progress }: IProps) {
    return (
        <View className="h-1 overflow-hidden rounded-full bg-gray-200">
            <Animated.View className="h-full bg-blue-500" style={{ width: `${progress}%` }} />
        </View>
    );
}
