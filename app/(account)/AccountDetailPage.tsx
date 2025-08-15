import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { useUserStore } from '~/stores/useUserStore';

export default function AccountDetailPage() {
    const user = useUserStore((state) => state.user);

    if (!user) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500">No user found</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-white p-4">
            <View className="mb-6 items-center">
                {user.image ? (
                    <Image
                        source={{ uri: user.image }}
                        className="h-24 w-24 rounded-full"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="h-24 w-24 items-center justify-center rounded-full bg-gray-300">
                        <Text className="text-xl text-white">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                    </View>
                )}
                <Text className="mt-4 font-bold text-xl text-gray-900">{user.name}</Text>
                <Text className="text-sm text-gray-500">@{user.userName}</Text>
            </View>

            <View className="space-y-2">
                <Detail label="Email" value={user.email} />
                <Detail label="Bio" value={user.bio || 'No bio provided'} />
                <Detail label="Telegram ID" value={user.telegramId || 'Not linked'} />
                <Detail label="Confirmed" value={user.isConfirmed ? 'Yes' : 'No'} />
                <Detail label="Role" value={user.role} />
                <Detail label="Created At" value={new Date(user.createdAt).toLocaleString()} />
                <Detail label="Updated At" value={new Date(user.updatedAt).toLocaleString()} />
            </View>
        </ScrollView>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <View className="flex-row justify-between border-b border-gray-100 py-2">
            <Text className="font-medium text-gray-600">{label}</Text>
            <Text className="text-gray-900">{value}</Text>
        </View>
    );
}
