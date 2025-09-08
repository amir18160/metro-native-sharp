import { ActivityIndicator, Pressable } from 'react-native';
import { Text } from '../nativewindui/Text';

interface IProps {
    onPress: () => void;
    isPending?: boolean;
    title: string;
    className?: string;
    children?: React.ReactNode;
}
export default function SubmitButton({ onPress, isPending, title, className, children }: IProps) {
    return (
        <Pressable
            className={`mt-4 items-center rounded-full bg-blue-600 p-4 active:bg-blue-700 disabled:bg-gray-600 disabled:opacity-70 ${className}`}
            onPress={onPress}
            disabled={isPending}>
            {isPending ? (
                <ActivityIndicator color="#fff" />
            ) : children ? (
                children
            ) : (
                <Text className="font-bold text-lg text-white">{title}</Text>
            )}
        </Pressable>
    );
}
