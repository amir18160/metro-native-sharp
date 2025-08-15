import { Pressable, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

type ActionButtonProps = {
    icon: keyof typeof Feather.glyphMap;
    text: string;
    onPress: () => void;
    color: string;
};

export const ActionButton = ({ icon, text, onPress, color }: ActionButtonProps) => (
    <Pressable
        onPress={onPress}
        className={`flex-row items-center space-x-1.5 rounded-lg px-3 py-1.5 ${color}`}
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1.0 })}>
        <Feather name={icon} size={14} color="white" />
        <Text className="font-bold text-xs text-white">{text}</Text>
    </Pressable>
);
