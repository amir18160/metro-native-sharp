import { View, Pressable } from 'react-native';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function QuickAccessMenu() {
    return (
        <View>
            <Pressable onPress={() => console.log('pressed')}>
                <MaterialIcons
                    className="h-12 w-12 rounded-full bg-rose-500 text-center text-xs leading-[48px] text-white shadow-md"
                    name="dnd-forwardslash"
                    size={24}
                    color="white"
                />
            </Pressable>
            <Pressable onPress={() => console.log('pressed')}>
                <MaterialIcons
                    className="h-12 w-12 rounded-full bg-rose-500 text-center text-xs leading-[48px] text-white shadow-md"
                    name="g-mobiledata"
                    size={24}
                    color="white"
                />
            </Pressable>
            <Pressable onPress={() => console.log('pressed')}>
                <MaterialIcons
                    className="h-12 w-12 rounded-full bg-rose-500 text-center text-xs leading-[48px] text-white shadow-md"
                    name="laptop"
                    size={24}
                    color="white"
                />
            </Pressable>
        </View>
    );
}
