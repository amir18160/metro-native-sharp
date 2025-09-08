import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    Dimensions,
    TextInput,
    Alert,
    StyleSheet,
    FlatList,
    Platform,
    Linking,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { folders } from '~/constants/folders';

interface Tab {
    id: string;
    title: string;
    url: string;
    history: string[];
    currentIndex: number;
    hasError?: boolean;
    errorMessage?: string | null;
}

const INTERCEPTED_DOWNLOAD_PREFIXES = ['https://api.subsource.net/v1/subtitle/download/'];

export default function MultiTabBrowser() {
    const [tabs, setTabs] = useState<Tab[]>([
        {
            id: '1',
            title: 'Google',
            url: 'https://google.com',
            history: ['https://google.com'],
            currentIndex: 0,
            hasError: false,
            errorMessage: null,
        },
    ]);
    const [activeTabId, setActiveTabId] = useState<string>('1');
    const [newUrl, setNewUrl] = useState<string>('');
    const [showTabsModal, setShowTabsModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showHome, setShowHome] = useState<boolean>(true);

    const webViewRef = useRef<WebView>(null);
    const tabsModalTranslateY = useSharedValue(Dimensions.get('window').height);
    const historyModalTranslateY = useSharedValue(Dimensions.get('window').height);
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const activeTab = tabs.find((t) => t.id === activeTabId)!;

    const tabsModalStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: tabsModalTranslateY.value }],
    }));
    const historyModalStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: historyModalTranslateY.value }],
    }));

    const openModal = (type: 'tabs' | 'history') => {
        if (type === 'tabs') {
            tabsModalTranslateY.value = Dimensions.get('window').height;
            setShowTabsModal(true);
            tabsModalTranslateY.value = withTiming(0, {
                duration: 300,
                easing: Easing.out(Easing.cubic),
            });
        } else {
            historyModalTranslateY.value = Dimensions.get('window').height;
            setShowHistoryModal(true);
            historyModalTranslateY.value = withTiming(0, {
                duration: 300,
                easing: Easing.out(Easing.cubic),
            });
        }
    };

    const closeModal = (type: 'tabs' | 'history') => {
        const closeAction = () => {
            if (!isMounted.current) return;
            if (type === 'tabs') setShowTabsModal(false);
            else setShowHistoryModal(false);
        };
        if (type === 'tabs') {
            tabsModalTranslateY.value = withTiming(
                Dimensions.get('window').height,
                { duration: 250, easing: Easing.in(Easing.cubic) },
                (finished) => {
                    if (finished) runOnJS(closeAction)();
                }
            );
        } else {
            historyModalTranslateY.value = withTiming(
                Dimensions.get('window').height,
                { duration: 250, easing: Easing.in(Easing.cubic) },
                (finished) => {
                    if (finished) runOnJS(closeAction)();
                }
            );
        }
    };

    const tabsPanGesture = Gesture.Pan()
        .onUpdate((event) => {
            if (event.translationY > 0) tabsModalTranslateY.value = event.translationY;
        })
        .onEnd((event) => {
            if (event.translationY > 100) runOnJS(closeModal)('tabs');
            else tabsModalTranslateY.value = withSpring(0, { damping: 15, stiffness: 150 });
        });

    const historyPanGesture = Gesture.Pan()
        .onUpdate((event) => {
            if (event.translationY > 0) historyModalTranslateY.value = event.translationY;
        })
        .onEnd((event) => {
            if (event.translationY > 100) runOnJS(closeModal)('history');
            else historyModalTranslateY.value = withSpring(0, { damping: 15, stiffness: 150 });
        });

    // New tab opens to Home (placeholder url). closeTabsModalAutomatically will close modal when true.
    const addTab = (
        urlOverride?: string,
        titleOverride?: string,
        closeTabsModalAutomatically = true
    ) => {
        const defaultPlaceholder = 'about:blank';
        const url = (urlOverride || defaultPlaceholder).trim();
        const id = Date.now().toString();
        const tab: Tab = {
            id,
            title: titleOverride || 'New Tab',
            url,
            history: [url],
            currentIndex: 0,
            hasError: false,
            errorMessage: null,
        };
        setTabs((prev) => [...prev, tab]);
        setActiveTabId(id);
        setNewUrl('');
        setShowHome(true);
        if (closeTabsModalAutomatically) closeModal('tabs');
    };

    const openUrlInTab = (url: string, title?: string) => {
        const existing = tabs.find((t) => t.url === url && !t.hasError);
        if (existing) {
            setActiveTabId(existing.id);
        } else {
            const id = Date.now().toString();
            const tab: Tab = {
                id,
                title: title || url,
                url,
                history: [url],
                currentIndex: 0,
                hasError: false,
                errorMessage: null,
            };
            setTabs((prev) => [...prev, tab]);
            setActiveTabId(id);
        }
        setShowHome(false);
    };

    const closeTab = (id: string) => {
        if (tabs.length === 1) return;
        const filtered = tabs.filter((t) => t.id !== id);
        setTabs(filtered);
        if (activeTabId === id) setActiveTabId(filtered[0].id);
    };

    const updateTab = (id: string, url: string, title?: string) => {
        setTabs((prev) =>
            prev.map((tab) => {
                if (tab.id === id) {
                    const newHistory = [...tab.history.slice(0, tab.currentIndex + 1), url];
                    return {
                        ...tab,
                        url,
                        title: title || tab.title,
                        history: newHistory,
                        currentIndex: newHistory.length - 1,
                        hasError: false,
                        errorMessage: null,
                    };
                }
                return tab;
            })
        );
    };

    const goBack = () => {
        if (!activeTab || activeTab.currentIndex <= 0) return;
        const newIndex = activeTab.currentIndex - 1;
        setTabs((prev) =>
            prev.map((tab) =>
                tab.id === activeTabId
                    ? { ...tab, url: tab.history[newIndex], currentIndex: newIndex }
                    : tab
            )
        );
        setShowHome(false);
    };

    const goForward = () => {
        if (!activeTab || activeTab.currentIndex >= activeTab.history.length - 1) return;
        const newIndex = activeTab.currentIndex + 1;
        setTabs((prev) =>
            prev.map((tab) =>
                tab.id === activeTabId
                    ? { ...tab, url: tab.history[newIndex], currentIndex: newIndex }
                    : tab
            )
        );
        setShowHome(false);
    };

    const goToGoogle = () => {
        updateTab(activeTabId, 'https://google.com', 'Google');
        setShowHome(false);
    };

    const downloadManually = async (url: string, title: string | null = null) => {
        try {
            const subtitlesDir = FileSystem.documentDirectory + folders.subtitles;
            const response = await fetch(url, { method: 'HEAD' });
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'download.file';
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/);
                if (match && match[1]) filename = decodeURIComponent(match[1]);
            } else {
                filename = title
                    ? title
                          .replace(/\|.*$/, '')
                          .replace(/[:\/%\s]+/g, '-')
                          .replace(/-+/g, '-')
                          .replace(/^-|-$/g, '')
                    : decodeURIComponent(url.split('/').pop() || filename);
            }
            const fileUri = subtitlesDir + filename;

            if (!fileUri.endsWith('.zip')) {
                Alert.alert('Download Failed', 'Only Zip files are supported.');
                return;
            }

            const { uri } = await FileSystem.downloadAsync(url, fileUri);
            Alert.alert('Download Complete', `Saved to ${uri}`);
        } catch (error: any) {
            Alert.alert('Download Failed', error.message);
        }
    };

    const shouldIntercept = (url: string) =>
        INTERCEPTED_DOWNLOAD_PREFIXES.some((prefix) => url.startsWith(prefix));

    const truncateTitle = (title: string, maxLength = 20) =>
        title.length <= maxLength ? title : title.substring(0, maxLength - 3) + '...';

    const handleReload = () => {
        if (!showHome && webViewRef.current) webViewRef.current.reload();
    };

    const retryLoad = () => {
        if (!activeTab) return;
        setTabs((prev) =>
            prev.map((t) =>
                t.id === activeTabId ? { ...t, hasError: false, errorMessage: null } : t
            )
        );
        webViewRef.current?.reload();
    };

    // Render Tab modal with Add Tab on top and scrollable list (FlatList)
    const renderTabModal = () => (
        <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={styles.modalSafeArea}>
            <Animated.View style={[styles.modalContainer, tabsModalStyle]}>
                <GestureDetector gesture={tabsPanGesture}>
                    <View style={styles.modalHeader}>
                        <Pressable
                            style={styles.headerLeft}
                            onPress={() => addTab(undefined, undefined, true)}>
                            <Ionicons name="add" size={22} color="white" />
                            <Text style={styles.newTabTextSmall}>New Tab</Text>
                        </Pressable>

                        <Text style={styles.modalTitle}>Tabs</Text>

                        <Pressable onPress={() => closeModal('tabs')}>
                            <Ionicons name="close" size={24} color="#333" />
                        </Pressable>
                    </View>
                </GestureDetector>

                <FlatList
                    data={tabs}
                    keyExtractor={(t) => t.id}
                    style={styles.modalContent}
                    contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
                    renderItem={({ item }) => (
                        <Pressable
                            key={item.id}
                            style={[
                                styles.tabItem,
                                item.id === activeTabId && styles.activeTabItem,
                            ]}
                            onPress={() => {
                                setActiveTabId(item.id);
                                closeModal('tabs');
                                setShowHome(false);
                            }}>
                            <View style={styles.tabInfo}>
                                <Text style={styles.tabTitle}>{truncateTitle(item.title)}</Text>
                                <Text style={styles.tabUrl} numberOfLines={1}>
                                    {item.url}
                                </Text>
                            </View>
                            <Pressable onPress={() => closeTab(item.id)}>
                                <Ionicons name="close" size={20} color="#666" />
                            </Pressable>
                        </Pressable>
                    )}
                    // small optimization so long lists don't re-render badly
                    initialNumToRender={10}
                />
            </Animated.View>
        </SafeAreaView>
    );

    const renderHistoryModal = () => (
        <Animated.View style={[styles.modalContainer, historyModalStyle]}>
            <GestureDetector gesture={historyPanGesture}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>History</Text>
                    <Pressable onPress={() => closeModal('history')}>
                        <Ionicons name="close" size={24} color="#333" />
                    </Pressable>
                </View>
            </GestureDetector>

            <FlatList
                data={activeTab?.history ?? []}
                keyExtractor={(_, idx) => idx.toString()}
                style={styles.modalContent}
                contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
                renderItem={({ item, index }) => (
                    <Pressable
                        style={styles.historyItem}
                        onPress={() => {
                            setTabs((prev) =>
                                prev.map((tab) =>
                                    tab.id === activeTabId
                                        ? { ...tab, url: item, currentIndex: index }
                                        : tab
                                )
                            );
                            closeModal('history');
                            setShowHome(false);
                        }}>
                        <Text
                            style={[
                                styles.historyUrl,
                                index === activeTab.currentIndex && styles.activeHistory,
                            ]}
                            numberOfLines={1}>
                            {item}
                        </Text>
                    </Pressable>
                )}
            />
        </Animated.View>
    );

    const homeTiles = [
        { id: 'google', title: 'Google', url: 'https://google.com' },
        { id: 'subsource', title: '✅ Subsource', url: 'https://subsource.net' },
        { id: 'subf2m', title: '✅ Subf2m', url: 'https://subf2m.co/' },
        { id: 'subtitlestar', title: 'Subtitlestar', url: 'https://subtitlestar.com/' },
        { id: 'subkade', title: 'Subkade', url: 'https://subkade.ir/' },
    ];

    const HomeScreen = () => (
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.homeContainer}>
            <Text style={styles.homeTitle}>Welcome — pick a page</Text>
            <FlatList
                data={homeTiles}
                keyExtractor={(i) => i.id}
                numColumns={2}
                contentContainerStyle={{ padding: 12 }}
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.tile}
                        onPress={() => openUrlInTab(item.url, item.title)}>
                        <Text style={styles.tileTitle}>{item.title}</Text>
                        <Text style={styles.tileUrl} numberOfLines={1}>
                            {item.url}
                        </Text>
                    </Pressable>
                )}
            />
            <View style={{ padding: 12 }}>
                <Text style={{ color: '#666' }}>Or paste a URL below to open:</Text>
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                    <TextInput
                        placeholder="https://..."
                        value={newUrl}
                        onChangeText={setNewUrl}
                        style={[styles.urlInput, { flex: 1, marginRight: 8 }]}
                        keyboardType="url"
                        autoCapitalize="none"
                        onSubmitEditing={() => {
                            addTab(newUrl || undefined, undefined, false);
                            setTabs((prev) =>
                                prev.map((t) =>
                                    t.id === prev[prev.length - 1].id
                                        ? {
                                              ...t,
                                              url: newUrl || 'about:blank',
                                              history: [newUrl || 'about:blank'],
                                              currentIndex: 0,
                                          }
                                        : t
                                )
                            );
                            setShowHome(false);
                        }}
                    />
                    <Pressable
                        style={styles.goButton}
                        onPress={() => {
                            addTab(newUrl || undefined, undefined, false);
                            setTabs((prev) =>
                                prev.map((t) =>
                                    t.id === prev[prev.length - 1].id
                                        ? {
                                              ...t,
                                              url: newUrl || 'about:blank',
                                              history: [newUrl || 'about:blank'],
                                              currentIndex: 0,
                                          }
                                        : t
                                )
                            );
                            setShowHome(false);
                        }}>
                        <Text style={styles.goButtonText}>Open</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );

    return (
        <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.container}>
            {showHome ? (
                <HomeScreen />
            ) : (
                <>
                    <View style={styles.urlContainer}>
                        <TextInput
                            placeholder="Enter URL"
                            style={styles.urlInput}
                            value={newUrl}
                            onChangeText={setNewUrl}
                            onSubmitEditing={() => addTab(undefined)}
                            keyboardType="url"
                            autoCapitalize="none"
                        />
                        <Pressable
                            onPress={() => {
                                if (!activeTab) addTab(newUrl || undefined, undefined, false);
                                else updateTab(activeTabId, newUrl || 'about:blank');
                                setShowHome(false);
                            }}
                            style={styles.goButton}>
                            <Text style={styles.goButtonText}>Go</Text>
                        </Pressable>
                    </View>

                    <WebView
                        ref={webViewRef}
                        key={activeTab.id}
                        source={{ uri: activeTab.url }}
                        style={styles.webview}
                        startInLoadingState
                        onNavigationStateChange={(navState: WebViewNavigation) => {
                            if (navState.url !== activeTab.url)
                                updateTab(activeTabId, navState.url, navState.title);
                        }}
                        onError={(syntheticEvent) => {
                            const nativeEvent: any = syntheticEvent.nativeEvent;
                            const errMsg =
                                nativeEvent?.description || nativeEvent?.domain || 'Unknown error';
                            setTabs((prev) =>
                                prev.map((t) =>
                                    t.id === activeTabId
                                        ? { ...t, hasError: true, errorMessage: errMsg }
                                        : t
                                )
                            );
                        }}
                        onHttpError={(syntheticEvent) => {
                            const { statusCode } = syntheticEvent.nativeEvent;
                            setTabs((prev) =>
                                prev.map((t) =>
                                    t.id === activeTabId
                                        ? {
                                              ...t,
                                              hasError: true,
                                              errorMessage: `HTTP ${statusCode}`,
                                          }
                                        : t
                                )
                            );
                        }}
                        onLoadEnd={() => {
                            setTabs((prev) =>
                                prev.map((t) =>
                                    t.id === activeTabId
                                        ? { ...t, hasError: false, errorMessage: null }
                                        : t
                                )
                            );
                        }}
                    />
                </>
            )}

            {/* Bottom bar always visible */}
            <View style={styles.bottomBar}>
                <Pressable style={styles.navButton} onPress={() => setShowHome(true)}>
                    <Ionicons name="home" size={24} color="#333" />
                </Pressable>

                <Pressable
                    style={styles.navButton}
                    onPress={goBack}
                    disabled={!activeTab || activeTab.currentIndex === 0}>
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={!activeTab || activeTab.currentIndex === 0 ? '#ccc' : '#333'}
                    />
                </Pressable>

                <Pressable
                    style={styles.navButton}
                    onPress={goForward}
                    disabled={
                        !activeTab || activeTab.currentIndex === activeTab.history.length - 1
                    }>
                    <Ionicons
                        name="arrow-forward"
                        size={24}
                        color={
                            !activeTab || activeTab.currentIndex === activeTab.history.length - 1
                                ? '#ccc'
                                : '#333'
                        }
                    />
                </Pressable>

                <Pressable
                    style={styles.navButton}
                    onPress={handleReload}
                    disabled={showHome || !webViewRef.current}>
                    <Ionicons
                        name="reload"
                        size={22}
                        color={showHome || !webViewRef.current ? '#ccc' : '#333'}
                    />
                </Pressable>

                <Pressable style={styles.tabButton} onPress={() => openModal('tabs')}>
                    <MaterialIcons name="tab" size={24} color="#333" />
                </Pressable>

                <Pressable style={styles.navButton} onPress={goToGoogle}>
                    <Ionicons name="logo-google" size={24} color="#333" />
                </Pressable>

                <Pressable style={styles.navButton} onPress={() => openModal('history')}>
                    <Ionicons name="list" size={24} color="#333" />
                </Pressable>

                {activeTab?.hasError && !showHome && (
                    <Pressable style={[styles.navButton, { marginLeft: 6 }]} onPress={retryLoad}>
                        <Text style={{ color: '#d9534f', fontWeight: '700' }}>Retry</Text>
                    </Pressable>
                )}
            </View>

            <View style={styles.titleContainer}>
                <Text style={styles.titleText} numberOfLines={1}>
                    {showHome ? 'Home' : truncateTitle(activeTab.title || activeTab.url, 30)}
                </Text>
            </View>

            {showTabsModal && renderTabModal()}
            {showHistoryModal && renderHistoryModal()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    urlContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    urlInput: {
        flex: 1,
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginRight: 10,
        backgroundColor: '#f9f9f9',
    },
    goButton: {
        backgroundColor: '#4285F4',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    goButtonText: { color: 'white', fontWeight: 'bold' },
    webview: { flex: 1, width: Dimensions.get('window').width },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingHorizontal: 8,
    },
    navButton: { padding: 10, marginRight: 6 },
    tabButton: { padding: 10, backgroundColor: '#e9e9e9', borderRadius: 20, marginRight: 6 },
    titleContainer: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    titleText: { textAlign: 'center', color: '#666', fontSize: 14 },

    // modal + tab styles
    modalSafeArea: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 9999 },
    modalContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: Dimensions.get('window').height * 0.7,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: Platform.OS === 'ios' ? 12 : 16,
        paddingTop: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 12,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4285F4',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    newTabTextSmall: { color: 'white', fontWeight: '700', marginLeft: 6, fontSize: 14 },
    modalTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
    modalContent: { flex: 1 },
    tabItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginBottom: 10,
    },
    activeTabItem: { backgroundColor: '#e3f2fd', borderWidth: 1, borderColor: '#bbdefb' },
    tabInfo: { flex: 1, marginRight: 10 },
    tabTitle: { fontWeight: 'bold', marginBottom: 4 },
    tabUrl: { color: '#666', fontSize: 12 },
    historyItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
    historyUrl: { color: '#666' },
    activeHistory: { color: '#4285F4', fontWeight: 'bold' },

    // Home screen
    homeContainer: { flex: 1, backgroundColor: '#fff' },
    homeTitle: { fontSize: 22, fontWeight: '700', padding: 16, color: '#333' },
    tile: {
        flex: 1,
        margin: 8,
        minHeight: 100,
        backgroundColor: '#f7f7f7',
        borderRadius: 12,
        padding: 12,
        justifyContent: 'center',
    },
    tileTitle: { fontWeight: '700', marginBottom: 6 },
    tileUrl: { color: '#666', fontSize: 12 },
});
