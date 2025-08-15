import { Stack, useNavigation } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import { DrawerActions } from '@react-navigation/native';

export default function UserLayout() {
    const navigation = useNavigation();

    return (
        <Stack
            screenOptions={{
                headerLeft: () => (
                    <Entypo
                        name="menu"
                        size={24}
                        color="black"
                        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer)}
                    />
                ),
            }}
        />
    );
}
