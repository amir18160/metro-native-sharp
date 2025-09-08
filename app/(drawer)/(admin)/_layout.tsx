import { Redirect, Tabs, useNavigation } from 'expo-router';
import { useUserStore } from '~/stores/useUserStore';
import { Roles } from '~/types/common/roles';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Animated, Pressable, View } from 'react-native';
import { MaterialCommunityIcons, Entypo, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import QuickAccessButton from '~/components/QuickAccess/QuickAccessButton';
import { useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const ICON_ACTIVE = ['#6366F1', '#8B5CF6'];
const ICON_INACTIVE = ['#D4D4D8', '#D4D4D8'];

export default function AdminLayout() {
    const user = useUserStore((state) => state.user);
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const isAdmin = user?.role === Roles.Admin;
    const isOwner = user?.role === Roles.Owner;
    if (!isAdmin && !isOwner) {
        return <Redirect href="/(drawer)/(user)/Home" />;
    }

    const renderTabIcon = (focused: boolean, IconComp: any, iconName: string) => (
        <View style={styles.tabItem}>
            <LinearGradient
                colors={focused ? (ICON_ACTIVE as any) : ICON_INACTIVE}
                style={styles.iconContainer}>
                <IconComp name={iconName} size={24} color={focused ? 'white' : ICON_ACTIVE[0]} />
            </LinearGradient>
        </View>
    );

    // Custom animated tab button with proper centering
    const AnimatedTabButton = ({ children, onPress }: any) => {
        const scaleAnim = useRef(new Animated.Value(1)).current;

        const handlePressIn = () => {
            Animated.spring(scaleAnim, {
                toValue: 0.92,
                useNativeDriver: true,
            }).start();
        };

        const handlePressOut = () => {
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }).start();
        };

        return (
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}
                android_ripple={{ color: 'transparent' }}
                style={styles.pressableCenter}>
                <Animated.View
                    style={{
                        transform: [{ scale: scaleAnim }],
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                    }}>
                    {children}
                </Animated.View>
            </Pressable>
        );
    };

    return (
        <>
            {/* <QuickAccessButton /> */}
            <Tabs
                screenOptions={{
                    headerShown: true,
                    headerStyle: {
                        backgroundColor: ICON_ACTIVE[0],
                    },
                    headerTintColor: 'white',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontSize: 20,
                    },
                    headerLeft: () => (
                        <Pressable
                            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer)}
                            android_ripple={{ color: 'transparent' }}
                            style={styles.menuButton}>
                            <Entypo name="menu" size={28} color="white" />
                        </Pressable>
                    ),
                    tabBarStyle: {
                        position: 'absolute',
                        bottom: -10,
                        left: 20,
                        right: 20,
                        elevation: 0,
                        backgroundColor: '#fff',
                        borderRadius: 15,
                        height: insets.bottom ? 100 : 60,
                        shadowColor: ICON_ACTIVE[0],
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: 0.15,
                        shadowRadius: 4,
                        paddingBottom: insets.bottom,
                    },
                    tabBarShowLabel: false,
                    tabBarButton: (props) => <AnimatedTabButton {...props} />,
                }}>
                <Tabs.Screen
                    name="(tabs)/Dashboard"
                    options={{
                        tabBarIcon: ({ focused }) =>
                            renderTabIcon(focused, MaterialCommunityIcons, 'view-dashboard'),
                        headerTitle: 'Admin Dashboard',
                    }}
                />

                <Tabs.Screen
                    name="(tabs)/Telegram"
                    options={{
                        tabBarIcon: ({ focused }) =>
                            renderTabIcon(focused, FontAwesome5, 'telegram-plane'),
                        headerTitle: 'Telegram Tools',
                    }}
                />

                <Tabs.Screen
                    name="(tabs)/Torrents"
                    options={{
                        tabBarIcon: ({ focused }) =>
                            renderTabIcon(focused, MaterialCommunityIcons, 'magnet'),
                        headerTitle: 'Torrent Management',
                    }}
                />

                <Tabs.Screen
                    name="(tabs)/TasksProgress"
                    options={{
                        tabBarIcon: ({ focused }) =>
                            renderTabIcon(focused, MaterialCommunityIcons, 'progress-check'),
                        headerTitle: 'Task Progress',
                    }}
                />
                {isOwner && (
                    <Tabs.Screen
                        name="(tabs)/Logs"
                        options={{
                            tabBarIcon: ({ focused }) =>
                                renderTabIcon(focused, MaterialCommunityIcons, 'file-document'),
                            headerTitle: 'Logs',
                        }}
                    />
                )}

                <Tabs.Screen
                    name="(tabs)/Tags"
                    options={{
                        tabBarIcon: ({ focused }) => renderTabIcon(focused, AntDesign, 'tag'),
                        headerTitle: 'Tasks',
                    }}
                />
            </Tabs>
        </>
    );
}

const styles = StyleSheet.create({
    menuButton: {
        marginLeft: 15,
        padding: 5,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        top: -10,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: ICON_ACTIVE[0],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
    },
    pressableCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
