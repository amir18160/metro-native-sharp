import { Drawer } from 'expo-router/drawer';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    StatusBar,
    ImageBackground,
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
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useEffect } from 'react';

const CustomDrawerContent = (props: any) => {
    const progress = useSharedValue(0);

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
            <BlurView intensity={Platform.OS === 'ios' ? 10 : 10} style={styles.blurContainer}>
                <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContainer}>
                    <Animated.View
                        style={[styles.headerContainer, animatedStyles]}
                        entering={FadeInLeft.duration(500)}>
                        <View style={styles.avatar} />
                        <Text style={styles.headerTitle}>MetroMoviez</Text>
                        <Text style={styles.headerSubtitle}>MetroMoviez@company.com</Text>
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
                    <TouchableOpacity style={styles.logoutButton}>
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
    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={options}>
                <Drawer.Screen
                    name="(user)"
                    options={{
                        title: 'User Home',
                        drawerIcon: ({ color }) => <Ionicons name="home" size={20} color={color} />,
                    }}
                />
                <Drawer.Screen
                    name="(admin)"
                    options={{
                        title: 'Admin Dashboard',
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
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    blurContainer: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        backgroundColor: 'rgba(15, 23, 42, 0.674)',
    },
    scrollContainer: {
        paddingTop: 20,
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#334155',
        marginBottom: 15,
        borderWidth: 2,
        borderColor: 'rgba(99, 102, 241, 0.7)',
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
