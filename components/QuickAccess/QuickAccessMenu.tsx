// QuickAccessMenu.tsx
import React from 'react';
import { Pressable } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withDelay,
} from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type MenuItemProps = {
    name: string;
    color: string;
    index: number;
    isOpen: boolean;
};

const MenuItem = ({ name, color, index, isOpen }: MenuItemProps) => {
    const scale = useSharedValue(0);
    const translateY = useSharedValue(-20);
    const opacity = useSharedValue(0);

    React.useEffect(() => {
        if (isOpen) {
            scale.value = withDelay(index * 100, withSpring(1, { damping: 12 }));
            translateY.value = withDelay(index * 100, withSpring(0));
            opacity.value = withDelay(index * 100, withSpring(1));
        } else {
            scale.value = withSpring(0);
            translateY.value = withSpring(-20);
            opacity.value = withSpring(0);
        }
    }, [index, isOpen, opacity, scale, translateY]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }, { translateY: translateY.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[animatedStyle, { marginTop: 12 }]}>
            <Pressable
                onPress={() => console.log(name + ' pressed')}
                className={`h-12 w-12 rounded-full ${color} items-center justify-center shadow-md`}>
                <MaterialIcons name={name as any} size={24} color="white" />
            </Pressable>
        </Animated.View>
    );
};

export default function QuickAccessMenu({ isOpen }: { isOpen: boolean }) {
    const menuItems = [
        { name: 'dnd-forwardslash', color: 'bg-rose-500' },
        { name: 'g-mobiledata', color: 'bg-emerald-500' },
        { name: 'laptop', color: 'bg-orange-500' },
    ];

    return (
        <>
            {isOpen &&
                menuItems.map((item, index) => (
                    <MenuItem key={item.name} {...item} index={index} isOpen={isOpen} />
                ))}
        </>
    );
}
