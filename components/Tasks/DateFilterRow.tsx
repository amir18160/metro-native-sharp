import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { DateFilter } from '~/types/common/dateFilter';
import AnimatedDatePickerModal from '../common/AnimatedDatePickerModal';
import { IFilterAction } from './TaskFilterModal';
import { Text } from '../nativewindui/Text';
import AnimatedTextField from '../common/AnimatedTextField';
import { Ionicons } from '@expo/vector-icons';

export default function DateFilterRow({
    field,
    label,
    value,
    dispatch,
}: {
    field: 'createdAt' | 'updatedAt';
    label: string;
    value: DateFilter | undefined;
    dispatch: React.Dispatch<IFilterAction>;
}) {
    const [open, setOpen] = useState(false);

    const defaultValue = 'Select date filter';
    const pretty = value ? formatDateFilter(value) : defaultValue;

    const onChange = (v: DateFilter | undefined) => {
        const type = field === 'createdAt' ? 'SET_CREATED_AT' : 'SET_UPDATED_AT';
        dispatch({ type: type as any, payload: v });
    };

    const onClear = () => onChange(undefined);

    return (
        <View className="mb-4">
            <Text className="mb-2 font-medium text-base">{label}</Text>

            <Pressable onPress={() => setOpen(true)}>
                <AnimatedTextField
                    value={pretty}
                    variant="default"
                    onChangeText={() => {}}
                    iconLeft={<Ionicons name="calendar" size={20} color="white" />}
                    disabled={true}
                    onRemove={() => onClear()}
                    size="sm"
                    removeButton={pretty !== defaultValue}
                />
            </Pressable>

            <AnimatedDatePickerModal
                visible={open}
                onClose={() => setOpen(false)}
                value={value}
                onChange={onChange as any}
                mode="advanced"
                title={label}
            />
        </View>
    );
}

/* helpers */
function formatDateFilter(filter: DateFilter): string {
    const parts: string[] = [];
    if (filter.equal) parts.push(`${fmt(filter.equal)}`);
    if (filter.greaterThan) parts.push(`> ${fmt(filter.greaterThan)}`);
    if (filter.greaterThanOrEqual) parts.push(`≥ ${fmt(filter.greaterThanOrEqual)}`);
    if (filter.lessThan) parts.push(`< ${fmt(filter.lessThan)}`);
    if (filter.lessThanOrEqual) parts.push(`≤ ${fmt(filter.lessThanOrEqual)}`);
    return parts.join(', ');
}

function fmt(val: string) {
    return new Date(val).toLocaleDateString();
}
