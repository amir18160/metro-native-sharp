import { useState, useRef, useMemo } from 'react';
import {
    View,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
// Assuming these are custom components from your project structure
import { useGetLogContent } from '~/hooks/services/logs/useGetLogContent';
import { Text } from '~/components/nativewindui/Text';
import { AntDesign } from '@expo/vector-icons';

export default function LogDetailPage() {
    const { LogName }: { LogName: string } = useLocalSearchParams();
    const log = useGetLogContent({ filename: LogName });
    const listRef = useRef<FlatList<string>>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

    // Split log into lines for virtualized rendering
    const lines = useMemo(() => (log.data ? log.data.split('\n') : []), [log.data]);

    // Find matches
    const matches = useMemo(() => {
        if (!searchQuery) return [];
        return lines
            .map((line, idx) => (line.toLowerCase().includes(searchQuery.toLowerCase()) ? idx : -1))
            .filter((idx) => idx !== -1);
    }, [searchQuery, lines]);

    const scrollToIndex = (index: number) => {
        if (matches.length === 0) return;
        const lineIndex = matches[index];
        if (lineIndex >= 0) {
            listRef.current?.scrollToIndex({ index: lineIndex, animated: true, viewPosition: 0.5 });
        }
        setCurrentMatchIndex(index);
    };

    // FIX: Add the onScrollToIndexFailed handler
    // This function handles cases where scrollToIndex fails because the target item is too far to be rendered.
    const onScrollToIndexFailed = (error: {
        index: number;
        highestMeasuredFrameIndex: number;
        averageItemLength: number;
    }) => {
        // First, scroll to an estimated offset based on the average item height.
        const offset = error.averageItemLength * error.index;
        listRef.current?.scrollToOffset({ offset, animated: true });

        // Give the list a moment to render the items at the new offset, then try again.
        setTimeout(() => {
            if (listRef.current) {
                listRef.current.scrollToIndex({
                    index: error.index,
                    animated: true,
                    viewPosition: 0.5,
                });
            }
        }, 100);
    };

    const scrollToTop = () => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    };

    const scrollToBottom = () => {
        listRef.current?.scrollToEnd({ animated: true });
    };

    if (log.isPending) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
                <ActivityIndicator size="large" />
                <Text className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                    در حال بارگزاری...
                </Text>
            </View>
        );
    }

    if (log.isError) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Text className="text-lg text-red-500">خطا در دریافت اطلاعات</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            <Stack.Screen options={{ title: LogName }} />

            {/* Search Bar */}
            <View className="flex-row items-center border-b border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
                <AntDesign name="search1" size={18} color="#888" className="mr-2" />
                <TextInput
                    value={searchQuery}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                        setCurrentMatchIndex(0);
                    }}
                    placeholder="جستجو در لاگ..."
                    placeholderTextColor="#999"
                    className="flex-1 rounded-md px-3 py-2 text-sm text-gray-800 dark:text-gray-200"
                />
                {matches.length > 0 && (
                    <View className="ml-2 flex-row items-center space-x-2">
                        <TouchableOpacity
                            onPress={() =>
                                scrollToIndex(
                                    (currentMatchIndex - 1 + matches.length) % matches.length
                                )
                            }
                            className="rounded-full bg-gray-200 p-2 dark:bg-gray-700">
                            <AntDesign name="up" size={16} color="white" />
                        </TouchableOpacity>
                        <Text className="text-xs text-gray-600 dark:text-gray-300">
                            {currentMatchIndex + 1}/{matches.length}
                        </Text>
                        <TouchableOpacity
                            onPress={() => scrollToIndex((currentMatchIndex + 1) % matches.length)}
                            className="rounded-full bg-gray-200 p-2 dark:bg-gray-700">
                            <AntDesign name="down" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Log viewer with virtualization */}
            <FlatList
                ref={listRef}
                data={lines}
                keyExtractor={(_, i) => String(i)}
                renderItem={({ item, index }) => {
                    const isMatch =
                        searchQuery && item.toLowerCase().includes(searchQuery.toLowerCase());
                    return (
                        <Text
                            selectable
                            className={`px-3 py-0.5 font-mono text-xs  ${
                                isMatch
                                    ? 'rounded-md bg-yellow-200 text-black dark:bg-yellow-600 dark:text-white'
                                    : 'text-gray-800 dark:text-gray-200'
                            }`}>
                            {item}
                        </Text>
                    );
                }}
                initialNumToRender={50}
                maxToRenderPerBatch={100}
                windowSize={21}
                removeClippedSubviews
                // FIX: Pass the handler to the FlatList
                onScrollToIndexFailed={onScrollToIndexFailed}
                contentContainerStyle={{ paddingBottom: 80 }}
            />

            {/* Scroll Buttons */}
            <View className="absolute bottom-4 right-4 flex-row space-x-3">
                <TouchableOpacity
                    onPress={scrollToTop}
                    className="rounded-full bg-gray-800 p-3 shadow-lg dark:bg-gray-700"
                    style={styles.buttonShadow}>
                    <AntDesign name="arrowup" size={20} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={scrollToBottom}
                    className="rounded-full bg-gray-800 p-3 shadow-lg dark:bg-gray-700"
                    style={styles.buttonShadow}>
                    <AntDesign name="arrowdown" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});
