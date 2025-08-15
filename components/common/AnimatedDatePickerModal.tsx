import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Platform, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    FadeIn,
    FadeOut,
    SlideInUp,
    SlideOutDown,
} from 'react-native-reanimated';
import DateTimePicker, {
    DateTimePickerAndroid,
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../nativewindui/Text';
import { AnimatedButton as Button } from '~/components/common/AnimatedButton';
import type { DateFilter } from '~/types/common/dateFilter';
import { Portal } from '@gorhom/portal';

/** ----- Types & constants ----- */

type OperatorKey = 'equal' | 'greaterThan' | 'greaterThanOrEqual' | 'lessThan' | 'lessThanOrEqual';

const OPERATOR_OPTIONS: { label: string; value: OperatorKey }[] = [
    { label: 'Equals', value: 'equal' },
    { label: 'After', value: 'greaterThan' },
    { label: 'After or Equal', value: 'greaterThanOrEqual' },
    { label: 'Before', value: 'lessThan' },
    { label: 'Before or Equal', value: 'lessThanOrEqual' },
];

type LegacyModes = 'simple' | 'advanced';
type ModernModes = 'single' | 'multi';

interface DatePickerModalProps {
    visible: boolean;
    onClose: () => void;
    value?: string | DateFilter;
    onChange: (value: string | DateFilter | undefined) => void;
    mode?: ModernModes | LegacyModes;
    title?: string;
    includeTime?: boolean;
    defaultOperator?: OperatorKey;
}

const toModernMode = (mode?: ModernModes | LegacyModes): ModernModes =>
    mode === 'simple' ? 'single' : mode === 'advanced' ? 'multi' : (mode ?? 'multi');

const isValidDate = (d: any) => d instanceof Date && !isNaN(d.getTime());

const parseISO = (s?: string) => {
    if (!s) return undefined;
    const d = new Date(s);
    return isValidDate(d) ? d : undefined;
};

const formatDateLabel = (d?: Date, includeTime?: boolean) => {
    if (!d || !isValidDate(d)) return 'unset';
    try {
        if (includeTime) {
            return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        return d.toLocaleDateString();
    } catch {
        return 'unset';
    }
};

const buildSingleValue = (op: OperatorKey, d: Date): DateFilter => ({ [op]: d.toISOString() });

/** ----- Component ----- */

export default function AnimatedDatePickerModal({
    visible,
    onClose,
    value,
    onChange,
    mode: rawMode = 'multi',
    title = 'Select Date Filters',
    includeTime = false,
    defaultOperator = 'equal',
}: DatePickerModalProps) {
    const mode = toModernMode(rawMode);
    const insets = useSafeAreaInsets();

    // Android nav bar height heuristic — tweak if needed. <-- adjust this if devices need different offset
    const ANDROID_NAVBAR_HEIGHT = 56; // px, typical soft navbar height (can be increased if needed)

    // MULTI mode: store multiple operator->date values
    const [filters, setFilters] = useState<Partial<DateFilter>>({});
    // SINGLE mode: store the operator + date separately
    const [singleOperator, setSingleOperator] = useState<OperatorKey>(defaultOperator);
    const [singleDate, setSingleDate] = useState<Date>(new Date());

    // Which operator is currently being edited via picker (Android or iOS inline)
    const [activePickerKey, setActivePickerKey] = useState<OperatorKey | 'single' | null>(null);

    // keep a ref to the latest incoming value so Reset can rehydrate
    const incomingValueRef = useRef<string | DateFilter | undefined>(value);

    // Animation: only opacity + translateY; no scaling to avoid width glitches
    const backdropOpacity = useSharedValue(0);
    const translateY = useSharedValue(50);

    /** Hydration function reused by effect and Reset button */
    const hydrateFromValue = (v?: string | DateFilter) => {
        incomingValueRef.current = v;
        if (mode === 'single') {
            if (typeof v === 'string') {
                const d = parseISO(v);
                if (d) setSingleDate(d);
                else setSingleDate(new Date());
                setSingleOperator(defaultOperator);
            } else if (v && typeof v === 'object') {
                const keys: OperatorKey[] = [
                    'equal',
                    'greaterThan',
                    'greaterThanOrEqual',
                    'lessThan',
                    'lessThanOrEqual',
                ];
                let matched = false;
                for (const k of keys) {
                    const s = (v as DateFilter)[k];
                    if (s) {
                        const d = parseISO(s);
                        if (d) {
                            setSingleOperator(k);
                            setSingleDate(d);
                            matched = true;
                            break;
                        }
                    }
                }
                if (!matched) {
                    setSingleOperator(defaultOperator);
                    setSingleDate(new Date());
                }
            } else {
                setSingleOperator(defaultOperator);
                setSingleDate(new Date());
            }
        } else {
            if (v && typeof v === 'object') {
                const next: Partial<DateFilter> = {};
                (Object.keys(v) as (keyof DateFilter)[]).forEach((k) => {
                    const d = parseISO(v[k]);
                    if (d) next[k] = d.toISOString();
                });
                setFilters(next);
            } else {
                setFilters({});
            }
        }
    };

    /** Initialize from incoming value */
    useEffect(() => {
        hydrateFromValue(value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, mode]);

    /** Animate open/close */
    useEffect(() => {
        if (visible) {
            backdropOpacity.value = withTiming(1, { duration: 180 });
            translateY.value = withTiming(0, {
                duration: 260,
                easing: Easing.out(Easing.cubic),
            });
        } else {
            backdropOpacity.value = withTiming(0, { duration: 150 });
            translateY.value = withTiming(50, { duration: 220 });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: backdropOpacity.value,
    }));

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    /** ----- Event handlers ----- */

    // Single mode: choose operator
    const onSelectSingleOperator = (op: OperatorKey) => {
        setSingleOperator(op);
        if (Platform.OS === 'android') {
            // open system picker
            setActivePickerKey('single');
            DateTimePickerAndroid.open({
                value: singleDate,
                mode: includeTime ? 'time' : 'date',
                onChange: (event, d) => handleAndroidChange(event, 'single', d),
                is24Hour: true,
            });
        } else {
            // iOS shows inline below header
            setActivePickerKey('single');
        }
    };

    // Multi mode: toggle operator chip
    const toggleOperator = (op: OperatorKey) => {
        const isActive = !!filters[op];
        if (isActive) {
            // remove operator
            setFilters((prev) => {
                const next = { ...prev };
                delete next[op];
                return next;
            });
            if (activePickerKey === op) setActivePickerKey(null);
            return;
        }

        // activate operator → pick a date
        const initial = new Date();
        if (Platform.OS === 'android') {
            setActivePickerKey(op);
            DateTimePickerAndroid.open({
                value: initial,
                mode: includeTime ? 'time' : 'date',
                onChange: (event, d) => handleAndroidChange(event, op, d),
                is24Hour: true,
            });
        } else {
            // iOS: set a default and show inline spinner
            setFilters((prev) => ({ ...prev, [op]: initial.toISOString() }));
            setActivePickerKey(op);
        }
    };

    // Android change handler (works for both single & multi)
    const handleAndroidChange = (
        event: DateTimePickerEvent,
        key: OperatorKey | 'single',
        selected?: Date
    ) => {
        if (event.type === 'dismissed') return;

        if (selected && isValidDate(selected)) {
            if (key === 'single') {
                setSingleDate(selected);
            } else {
                setFilters((prev) => ({ ...prev, [key]: selected.toISOString() }));
            }
        }
    };

    // iOS inline change handler for MULTI
    const handleIOSInlineChange = (op: OperatorKey, _ev: DateTimePickerEvent, d?: Date) => {
        if (!d || !isValidDate(d)) return;
        setFilters((prev) => ({ ...prev, [op]: d.toISOString() }));
    };

    // iOS inline change handler for SINGLE
    const handleIOSSingleChange = (_ev: DateTimePickerEvent, d?: Date) => {
        if (!d || !isValidDate(d)) return;
        setSingleDate(d);
    };

    const resetToIncoming = () => {
        // Reset internal state to whatever prop `value` currently is (no onChange)
        hydrateFromValue(incomingValueRef.current);
        setActivePickerKey(null);
    };

    const apply = () => {
        if (mode === 'single') {
            if (!isValidDate(singleDate)) {
                onClose();
                return;
            }
            onChange(buildSingleValue(singleOperator, singleDate));
            onClose();
            return;
        }

        // MULTI
        const compact: DateFilter = {};
        (Object.keys(filters) as OperatorKey[]).forEach((k) => {
            const d = parseISO(filters[k]);
            if (d) compact[k] = d.toISOString();
        });

        // If empty, treat as cleared
        onChange(Object.keys(compact).length ? compact : undefined);
        onClose();
    };

    /** ----- Derived UI state ----- */

    const selectedChips = useMemo(() => {
        if (mode === 'single') {
            return [
                {
                    key: singleOperator,
                    label:
                        OPERATOR_OPTIONS.find((o) => o.value === singleOperator)?.label ??
                        singleOperator,
                    dateLabel: formatDateLabel(singleDate, includeTime),
                },
            ];
        }
        const entries = (Object.keys(filters) as OperatorKey[])
            .filter((k) => !!filters[k])
            .map((k) => {
                const d = parseISO(filters[k]);
                const label = OPERATOR_OPTIONS.find((o) => o.value === k)?.label ?? k;
                return { key: k, label, dateLabel: formatDateLabel(d, includeTime) };
            });
        return entries;
    }, [mode, singleOperator, singleDate, filters, includeTime]);

    const isApplyDisabled =
        mode === 'single' ? !isValidDate(singleDate) : Object.keys(filters).length === 0;

    /** ----- Render ----- */

    if (!visible) return null;

    // compute sheet bottom offset so it doesn't overlap Android nav
    const sheetBottom = Platform.OS === 'android' ? ANDROID_NAVBAR_HEIGHT : 0;
    const sheetPaddingBottom = Math.max(insets.bottom, 16) + (Platform.OS === 'android' ? 12 : 0);

    return (
        <Portal>
            {/* Backdrop */}
            <Animated.View
                style={[styles.backdrop, backdropStyle]}
                entering={FadeIn.duration(160)}
                exiting={FadeOut.duration(140)}>
                <Pressable
                    accessible
                    accessibilityRole="button"
                    onPress={onClose}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>

            {/* Bottom Sheet (full width from the start) */}
            <Animated.View
                style={[
                    styles.sheet,
                    { bottom: sheetBottom, paddingBottom: sheetPaddingBottom },
                    sheetStyle,
                ]}
                entering={SlideInUp.springify().damping(18)}
                exiting={SlideOutDown}>
                <SafeAreaView>
                    {/* Header */}
                    <View className="mb-4 flex-row items-center justify-between">
                        <Text variant="heading">{title}</Text>
                        <Button
                            variant="ghost"
                            size="xs"
                            onPress={onClose}
                            className="rounded-full"
                            title="Close"
                        />
                    </View>

                    {/* Selected chips summary */}
                    {!!selectedChips.length && (
                        <View className="mb-3 flex-row flex-wrap gap-2">
                            {selectedChips.map((c) => (
                                <View
                                    key={`summary-${c.key}`}
                                    className="flex-row items-center rounded-full bg-secondary px-3 py-1.5">
                                    <Text className="text-secondary-foreground">
                                        {c.label}: {c.dateLabel}
                                    </Text>
                                    {mode === 'multi' && (
                                        <Pressable
                                            onPress={() => {
                                                setFilters((prev) => {
                                                    const next = { ...prev };
                                                    delete next[c.key as OperatorKey];
                                                    return next;
                                                });
                                                if (activePickerKey === c.key)
                                                    setActivePickerKey(null);
                                            }}
                                            className="bg-secondary/60 ml-2 rounded-full px-2 py-0.5"
                                            accessibilityRole="button"
                                            accessibilityLabel={`Remove ${c.label}`}>
                                            <Text className="text-secondary-foreground">✕</Text>
                                        </Pressable>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Operator chips */}
                    <View className="mb-4 flex-row flex-wrap gap-2">
                        {OPERATOR_OPTIONS.map(({ label, value }) => {
                            const isActive =
                                mode === 'single' ? singleOperator === value : !!filters[value];

                            const dateForChip =
                                mode === 'single'
                                    ? singleOperator === value
                                        ? singleDate
                                        : undefined
                                    : parseISO(filters[value]);

                            const dateText = isActive
                                ? formatDateLabel(dateForChip, includeTime)
                                : undefined;

                            return (
                                <Pressable
                                    key={value}
                                    onPress={() => {
                                        if (mode === 'single') {
                                            onSelectSingleOperator(value);
                                        } else {
                                            // MULTI toggle
                                            toggleOperator(value);
                                        }
                                    }}
                                    className={`flex-row items-center rounded-full px-3 py-2 ${
                                        isActive ? 'bg-primary' : 'bg-muted'
                                    }`}
                                    accessibilityRole="button"
                                    accessibilityState={{ selected: isActive }}>
                                    <Text
                                        className={`${isActive ? 'text-primary-foreground' : 'text-foreground'}`}>
                                        {label}
                                    </Text>
                                    {dateText && (
                                        <Text
                                            className={`ml-2 text-xs ${
                                                isActive
                                                    ? 'text-primary-foreground/90'
                                                    : 'text-muted-foreground'
                                            }`}>
                                            {dateText}
                                        </Text>
                                    )}
                                </Pressable>
                            );
                        })}
                    </View>

                    {/* Pickers */}
                    <View className="py-2">
                        {Platform.OS === 'ios' ? (
                            <>
                                {/* iOS SINGLE inline picker */}
                                {mode === 'single' && activePickerKey === 'single' && (
                                    <DateTimePicker
                                        value={singleDate}
                                        mode={includeTime ? 'datetime' : 'date'}
                                        display="spinner"
                                        onChange={handleIOSSingleChange}
                                        style={styles.iosPicker}
                                    />
                                )}

                                {/* iOS MULTI: inline for each active operator */}
                                {mode === 'multi' &&
                                    (Object.keys(filters) as OperatorKey[]).map((opKey) => {
                                        const val = parseISO(filters[opKey]);
                                        if (!val) return null;
                                        const opLabel =
                                            OPERATOR_OPTIONS.find((o) => o.value === opKey)
                                                ?.label ?? opKey;

                                        return (
                                            <View
                                                key={`picker-${opKey}`}
                                                className="bg-muted/50 mb-2 rounded-xl p-3">
                                                <Text className="mb-2 text-sm text-muted-foreground">
                                                    {opLabel}
                                                </Text>
                                                <DateTimePicker
                                                    value={val}
                                                    mode={includeTime ? 'datetime' : 'date'}
                                                    display="spinner"
                                                    onChange={(e, d) =>
                                                        handleIOSInlineChange(opKey, e, d!)
                                                    }
                                                    style={styles.iosPicker}
                                                />
                                            </View>
                                        );
                                    })}
                            </>
                        ) : (
                            // Android: pickers are opened via system modal; show hints
                            <View className="items-center">
                                <Text className="text-sm text-muted-foreground">
                                    Tap an operator to set or change its date.
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Footer actions: Reset | Clear | Apply */}
                    <View className="mt-4 flex-row justify-between gap-3">
                        <Button
                            variant="danger"
                            onPress={resetToIncoming}
                            className="flex-1"
                            title="Reset"
                        />

                        <Button
                            onPress={apply}
                            className={`flex-1 ${isApplyDisabled ? 'opacity-50' : 'bg-primary'}`}
                            title="Apply"
                            disabled={isApplyDisabled}
                        />
                    </View>
                </SafeAreaView>
            </Animated.View>
        </Portal>
    );
}

/** ----- Styles ----- */

const styles = StyleSheet.create({
    backdrop: {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        zIndex: 10,
    },
    sheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0, // overridden dynamically for Android
        zIndex: 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.16,
        shadowRadius: 20,
        elevation: 12,
    },
    iosPicker: {
        height: 190,
        width: '100%',
    },
});
