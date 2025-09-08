import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Drawer from 'expo-router/drawer';
import { View, Text, Pressable } from 'react-native';

import ServerAddressInput from '~/components/Settings/ServerAddressInput';
import { useUserStore } from '~/stores/useUserStore';

export default function Settings() {
    const userStore = useUserStore();
    const router = useRouter();

    const iconLeft = (
        <Pressable onPress={() => router.replace('/(auth)/Login')} className="px-4">
            <AntDesign name="arrowleft" size={22} color="white" />
        </Pressable>
    );

    return (
        <>
            {!userStore.user && (
                <Drawer.Screen
                    options={{
                        swipeEnabled: false,
                        headerLeft: () => iconLeft,
                    }}
                />
            )}

            <View className="flex-1 bg-gray-50 px-4 pt-6">
                <View className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <View className="mb-3 flex-row items-center">
                        <Ionicons name="server-outline" size={20} color="#374151" />
                        <Text className="ml-2 font-semibold text-lg text-gray-800">
                            Server Settings
                        </Text>
                    </View>

                    <ServerAddressInput
                        label="Server Address"
                        size="md"
                        showPasteButton
                        iconLeft={<Entypo name="link" size={20} color="white" />}
                    />
                </View>
            </View>
        </>
    );
}
