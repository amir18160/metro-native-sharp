import { useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ImageBackground,
    Image,
} from 'react-native';
import { DrawerContentScrollView, DrawerNavigationOptions } from '@react-navigation/drawer';
import Animated, {
    FadeInLeft,
    FadeOut,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserStore } from '~/stores/useUserStore';
import { Roles } from '~/types/common/roles';

const CustomDrawerContent = (props: any) => {
    const progress = useSharedValue(0);
    const insets = useSafeAreaInsets();
    const logout = useUserStore((state) => state.clearUser);

    useEffect(() => {
        progress.value = withSpring(1, { damping: 20 });
    }, [progress]);

    const animatedStyles = useAnimatedStyle(() => {
        const translateY = interpolate(progress.value, [0, 1], [-100, 0]);
        const opacity = interpolate(progress.value, [0, 1], [0, 1]);

        return {
            transform: [{ translateY }],
            opacity,
        };
    });

    return (
        <ImageBackground
            source={require('~/assets/drawer.png')}
            blurRadius={10}
            style={styles.background}>
            {/* Make the blur container extend into the status-bar safe area by applying paddingTop = insets.top */}
            <BlurView
                intensity={Platform.OS === 'ios' ? 10 : 10}
                style={[styles.blurContainer, { paddingTop: insets.top }]}>
                <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContainer}>
                    <Animated.View
                        style={[styles.headerContainer, animatedStyles]}
                        entering={FadeInLeft.duration(500)}>
                        <Image
                            source={require('~/assets/logo.png')}
                            className="h-32 w-32 rounded-md"
                            width={400}
                            height={400}
                        />
                        <Text style={styles.headerTitle}>MetroMoviez</Text>
                        <Text style={styles.headerSubtitle}>MetroMoviez.ir</Text>
                    </Animated.View>

                    <View style={styles.divider} />

                    <View style={styles.drawerList}>
                        {props.state.routes.map((route: any, index: number) => (
                            <Animated.View
                                key={route.key}
                                style={animatedStyles}
                                entering={FadeInLeft.delay(100 + index * 100).duration(500)}
                                exiting={FadeOut}>
                                <TouchableOpacity
                                    onPress={() => props.navigation.navigate(route.name)}
                                    style={[
                                        styles.drawerItem,
                                        props.state.index === index && styles.activeItem,
                                    ]}>
                                    <Ionicons
                                        name={route.name === '(user)' ? 'home' : 'settings'}
                                        size={22}
                                        color={props.state.index === index ? '#6366f1' : '#e2e8f0'}
                                        style={styles.icon}
                                    />
                                    <Text
                                        style={[
                                            styles.itemText,
                                            props.state.index === index && styles.activeText,
                                        ]}>
                                        {props.descriptors[route.key].options.title}
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>
                </DrawerContentScrollView>

                <Animated.View
                    style={[styles.footer, animatedStyles]}
                    entering={FadeInLeft.delay(300).duration(500)}>
                    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                        <Ionicons name="log-out" size={20} color="#f87171" />
                        <Text style={styles.logoutText}>Sign Out</Text>
                    </TouchableOpacity>
                    <Text style={styles.versionText}>v2.4.1</Text>
                </Animated.View>
            </BlurView>
        </ImageBackground>
    );
};

const DrawerLayout = () => {
    const user = useUserStore((state) => state.getUser)();

    return (
        <>
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={options}>
                <Drawer.Screen
                    name="(user)"
                    options={{
                        title: 'User Home',
                        headerShown: true,
                        drawerIcon: ({ color }) => <Ionicons name="home" size={20} color={color} />,
                    }}
                />
                {user && [Roles.Admin, Roles.Owner].includes(user.role) && (
                    <Drawer.Screen
                        name="(admin)"
                        options={{
                            title: 'Admin',
                            drawerIcon: ({ color }) => (
                                <MaterialIcons
                                    name="admin-panel-settings"
                                    size={20}
                                    color={color}
                                />
                            ),
                        }}
                    />
                )}

                <Drawer.Screen
                    name="(settings)/Settings"
                    options={{
                        title: 'Settings',
                        headerShown: true,
                        drawerIcon: ({ color }) => (
                            <Ionicons name="settings" size={20} color={color} />
                        ),
                    }}
                />
            </Drawer>
        </>
    );
};

const options: DrawerNavigationOptions = {
    headerShown: false,
    drawerType: 'slide',
    drawerStyle: {
        width: 280,
        backgroundColor: 'transparent',
    },

    drawerActiveTintColor: '#6366f1',
    drawerInactiveTintColor: '#94a3b8',
    drawerLabelStyle: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: -16,
    },
    headerStyle: { backgroundColor: '#6366f1' },
    headerTintColor: 'white',
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    // Remove fixed platform padding here; we'll apply insets.top dynamically in the component.
    blurContainer: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.674)',
    },
    scrollContainer: {
        // leave a little internal spacing below status area (actual top inset is handled on the BlurView).
        paddingTop: 20,
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#f1f5f9',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#94a3b8',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: 15,
        marginHorizontal: 20,
    },
    drawerList: {
        paddingHorizontal: 10,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginVertical: 4,
        marginHorizontal: 10,
    },
    activeItem: {
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
    },
    icon: {
        marginRight: 15,
    },
    itemText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#e2e8f0',
    },
    activeText: {
        color: '#6366f1',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    logoutText: {
        color: '#f87171',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 15,
    },
    versionText: {
        color: '#64748b',
        fontSize: 12,
        marginTop: 10,
        textAlign: 'center',
    },
});

export default DrawerLayout;
