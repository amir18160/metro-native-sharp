import { useEffect, useState } from 'react';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, BackHandler } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import SubmitButton from '~/components/common/SubmitButton';
import { Error } from '~/components/Error/Error';
import { Loading } from '~/components/Loading/Loading';
import { NoData } from '~/components/NoData/NoData';
import { useGetTempDocuments } from '~/hooks/services/documents/useGetTempDocuments';
import { useSelectedDocumentStore } from '~/stores/useSelectedDocumentStore';
import { useRouter } from 'expo-router';

export default function ForwardedFiles() {
    const tempDocuments = useGetTempDocuments();
    const selectDocuments = useSelectedDocumentStore();
    const router = useRouter();
    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        const backAction = () => {
            if (selected.length > 0) {
                setSelected([]);
                return true;
            }
            return false;
        };

        const subscription = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => subscription.remove();
    }, [selected]);

    if (tempDocuments.isLoading) return <Loading />;
    if (tempDocuments.isError) return <Error message="Failed to fetch forwarded files" />;
    if (!tempDocuments.data) return <NoData />;

    const data = tempDocuments.data.pages.flatMap((page) => page.data?.items || []);

    const toggleSelect = (id: string) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const onSubmitHandler = () => {
        const selectedWithDetails = data.filter((item) => selected.includes(item.id));

        if (selectedWithDetails.length > 0) {
            selectDocuments.setSelectedDocuments(selectedWithDetails);
            router.push('/(documents)/UpdateDocuments');
            return;
        }

        console.log('not data to submit');
    };

    const renderItem = ({ item }: any) => {
        const isSelected = selected.includes(item.id);

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleSelect(item.id)}
                className={`m-2 flex-row items-center rounded-xl border p-2 shadow-sm ${
                    isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'
                }`}>
                {/* Left icon */}
                <View
                    className={`mr-3 rounded-lg p-2 ${
                        isSelected ? 'bg-blue-100' : 'bg-emerald-100'
                    }`}>
                    <MaterialCommunityIcons
                        name="file-document-outline"
                        size={24}
                        color={isSelected ? '#2563eb' : '#059669'}
                    />
                </View>

                {/* File info */}
                <View className="flex-1">
                    {/* Full name (no truncation) */}
                    <Text className="font-medium text-gray-800">{item.fileName}</Text>

                    {/* Colorful meta chips */}
                    <View className="mt-1 flex-row flex-wrap">
                        <Text className="mr-auto mt-1 text-xs text-gray-500">
                            {(item.fileSize / (1024 * 1024)).toFixed(1)} MB
                        </Text>

                        <View className="flex-row gap-2">
                            <View className="mr-2 rounded-full bg-purple-100 px-2 py-0.5">
                                <Text className="text-xs text-purple-700">{item.resolution}</Text>
                            </View>
                            <View className="mr-2 rounded-full bg-pink-100 px-2 py-0.5">
                                <Text className="text-xs text-pink-700">{item.codec}</Text>
                            </View>
                            <View className="mr-2 rounded-full bg-amber-100 px-2 py-0.5">
                                <Text className="text-xs text-amber-700">{item.encoder}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Right side */}
                <View className="ml-2 items-end">
                    {isSelected ? (
                        <Ionicons name="checkmark-circle" size={22} color="#2563eb" />
                    ) : (
                        <Ionicons name="ellipse-outline" size={22} color="#d1d5db" />
                    )}
                    <Text className="mt-1 text-[10px] text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 bg-gray-50 pb-14">
            {selected.length > 0 && (
                <Animated.View entering={FadeInUp.duration(100)} className="px-4 py-2">
                    <SubmitButton
                        title="Proceed"
                        className="rounded-2xl bg-blue-500 shadow-md"
                        onPress={onSubmitHandler}>
                        <Text className="font-semibold text-lg text-white">
                            Proceed with {selected.length} file
                            {selected.length > 1 ? 's' : ''}
                        </Text>
                    </SubmitButton>
                </Animated.View>
            )}

            <FlatList
                keyExtractor={(item) => item.id}
                data={data}
                renderItem={renderItem}
                onEndReached={() => tempDocuments.fetchNextPage()}
                refreshControl={
                    <RefreshControl
                        refreshing={tempDocuments.isFetching}
                        onRefresh={() => tempDocuments.refetch()}
                    />
                }
                contentContainerStyle={{ paddingBottom: 100 }}
            />
        </View>
    );
}
