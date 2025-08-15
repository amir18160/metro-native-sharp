import { TextInput, View } from 'react-native';
import { Text } from '../nativewindui/Text';

interface IProps {
    label: string;
    value: string | null | undefined;
    onChange: (text: string) => void;
    placeholder?: string;
    keyboardType?: 'default' | 'numeric';
    error?: string;
    disabled?: boolean;
}

export default function FormField(data: IProps) {
    return (
        <View className="mb-4">
            <Text className="mb-2 font-medium text-sm text-gray-300">{data.label}</Text>
            <TextInput
                className={`rounded-lg border bg-gray-800 px-4 py-3 text-base text-gray-50 ${
                    data.error ? 'border-red-500' : 'border-gray-600'
                }`}
                value={data.value ?? ''}
                onChangeText={data.onChange}
                placeholder={data.placeholder}
                placeholderTextColor="#9ca3af"
                keyboardType={data.keyboardType}
                autoCapitalize="none"
                editable={!data.disabled}
                selectTextOnFocus={!data.disabled}
            />
            {data.error && <Text className="mt-1.5 text-xs text-red-400">{data.error}</Text>}
        </View>
    );
}
