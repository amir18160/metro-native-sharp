import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    Pressable,
    FlatList,
    Modal,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';

// NativeWind: use className on RN components
// Make sure you have nativewind configured in the project.

export type FileEntry = {
    uri: string; // full uri
    name: string;
    size?: number | null;
    modificationTime?: number | null;
};

type Action = {
    id: string;
    label: string;
    handler: (files: FileEntry[]) => Promise<void> | void;
};

type Props = {
    directory?: string; // default: FileSystem.documentDirectory
    allowMultiSelect?: boolean; // default: true
    showTopActions?: boolean; // show dotted action button on top bar
    fileFilter?: (file: FileEntry) => boolean; // optional filter
    autoRefreshIntervalMs?: number | null; // optional auto refresh
    onDelete?: (deleted: FileEntry[]) => void; // callback after delete
    onOpen?: (file: FileEntry) => void; // callback when open
    extraActions?: Action[]; // custom actions to show in action sheet
    emptyMessage?: string;
};

export default function FileManager({
    directory = FileSystem.documentDirectory!,
    allowMultiSelect = true,
    showTopActions = true,
    fileFilter,
    autoRefreshIntervalMs = null,
    onDelete,
    onOpen,
    extraActions = [],
    emptyMessage = 'No files found',
}: Props) {
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedUris, setSelectedUris] = useState<Set<string>>(new Set());
    const [actionModalVisible, setActionModalVisible] = useState(false);
    const [targetFileActions, setTargetFileActions] = useState<FileEntry | null>(null);
    const [topActionsVisible, setTopActionsVisible] = useState(false);
    const [importing, setImporting] = useState(false);

    const router = useRouter();

    const listFiles = useCallback(async () => {
        try {
            setLoading(true);
            // Ensure directory exists
            const dirPath = directory.endsWith('/') ? directory : directory + '/';
            const dirInfo = await FileSystem.getInfoAsync(dirPath);
            if (!dirInfo.exists) {
                // nothing to list
                setFiles([]);
                setLoading(false);
                return;
            }

            const listing = await FileSystem.readDirectoryAsync(directory);

            const entries: FileEntry[] = [];

            // gather metadata for each file
            for (const name of listing) {
                try {
                    const uri = directory + name;
                    const info = await FileSystem.getInfoAsync(uri, { size: true, md5: false });
                    entries.push({
                        uri,
                        name,
                        // @ts-expect-error //  unknown error
                        size: info.size ?? null,
                        // @ts-expect-error //  unknown error
                        modificationTime: info.modificationTime ?? null,
                    });
                } catch (error) {
                    console.log('error', error);
                }
            }

            // optional filter
            const filtered = fileFilter ? entries.filter(fileFilter) : entries;
            // sort by modification time desc
            filtered.sort((a, b) => (b.modificationTime || 0) - (a.modificationTime || 0));

            setFiles(filtered);
        } catch (err) {
            console.warn('FileManager listFiles error', err);
            Alert.alert('Error', 'Failed to list files');
        } finally {
            setLoading(false);
        }
    }, [directory, fileFilter]);

    useEffect(() => {
        listFiles();
        let t: number | undefined;
        if (autoRefreshIntervalMs && autoRefreshIntervalMs > 0) {
            t = setInterval(() => listFiles(), autoRefreshIntervalMs) as unknown as number;
        }
        return () => {
            if (t) clearInterval(t);
        };
    }, [listFiles, autoRefreshIntervalMs]);

    const toggleSelect = (uri: string) => {
        setSelectedUris((prev) => {
            const next = new Set(prev);
            if (next.has(uri)) next.delete(uri);
            else next.add(uri);
            return next;
        });
    };

    const clearSelection = () => setSelectedUris(new Set());

    const openFile = async (file: FileEntry) => {
        if (onOpen) {
            onOpen(file);
            return;
        }

        try {
            // prefer expo-sharing when possible
            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
                await Sharing.shareAsync(file.uri);
            } else {
                // fallback: try to open with router (works if you have a file viewer route)
                // We just call an example route: /viewer?uri=...
                // Consumers can override onOpen to handle opening.
                router.push({ pathname: '/viewer', params: { uri: file.uri } } as any);
            }
        } catch {
            Alert.alert('Open failed', 'Could not open the file');
        }
    };

    const deleteFiles = async (targets: FileEntry[]) => {
        if (!targets.length) return;

        Alert.alert(
            'Delete files',
            `Are you sure you want to delete ${targets.length} file(s)? This cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const deleted: FileEntry[] = [];
                        for (const f of targets) {
                            try {
                                await FileSystem.deleteAsync(f.uri, { idempotent: true });
                                deleted.push(f);
                            } catch (error) {
                                console.log('Error deleting file', f, error);
                            }
                        }
                        // refresh list and clear selection for deleted files
                        await listFiles();
                        setSelectedUris((prev) => {
                            const next = new Set(prev);
                            for (const d of deleted) next.delete(d.uri);
                            return next;
                        });
                        if (onDelete) {
                            onDelete(deleted);
                        }
                    },
                },
            ]
        );
    };

    const deleteSelected = () => {
        const targets = files.filter((f) => selectedUris.has(f.uri));

        deleteFiles(targets);
    };

    const deleteAll = () => {
        if (!files.length) return;
        deleteFiles(files);
    };

    const shareSelected = async () => {
        const targets = files.filter((f) => selectedUris.has(f.uri));
        if (!targets.length) return;
        try {
            const canShare = await Sharing.isAvailableAsync();
            if (!canShare) {
                Alert.alert('Share not available');
                return;
            }
            // share first file only (expo-sharing supports one file at a time)
            await Sharing.shareAsync(targets[0].uri);
        } catch {
            Alert.alert('Share failed');
        }
    };

    const openActionsForFile = (file: FileEntry) => {
        setTargetFileActions(file);
        setActionModalVisible(true);
    };

    const topDefaultActions: Action[] = [
        {
            id: 'delete-selected',
            label: 'Delete selected',
            handler: async (sel) => deleteFiles(sel),
        },
        { id: 'delete-all', label: 'Delete all files', handler: async (sel) => deleteAll() },
        { id: 'refresh', label: 'Refresh', handler: async () => await listFiles() },
        {
            id: 'share-selected',
            label: 'Share selected',
            handler: async (sel) => await shareSelected(),
        },
    ];

    const mergedTopActions = [...topDefaultActions, ...extraActions];

    const renderFileRow = ({ item }: { item: FileEntry }) => {
        const isSelected = selectedUris.has(item.uri);
        return (
            <Pressable
                onPress={() => {
                    if (allowMultiSelect) toggleSelect(item.uri);
                    else openFile(item);
                }}
                onLongPress={() => openActionsForFile(item)}
                className={`mb-2 flex-row items-center justify-between rounded-lg p-3 ${
                    isSelected ? 'bg-blue-100' : 'bg-white'
                }`}>
                <View className="flex-1">
                    <Text className="font-semibold text-sm text-gray-800">{item.name}</Text>
                    <Text className="text-xs text-gray-500">
                        {item.size != null
                            ? `${Math.round((item.size / 1024) * 100) / 100} KB`
                            : ''}
                    </Text>
                </View>

                <View className="flex-row items-center">
                    {/* dotted action button for this file */}
                    <TouchableOpacity onPress={() => openActionsForFile(item)} className="p-2">
                        <Text className="text-xl text-gray-500">⋮</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header with top action (dotted) */}
            <View className="flex-row items-center justify-between border-b bg-white p-3">
                <Text className="font-bold text-lg">File Manager</Text>

                <View className="flex-row items-center">
                    {/* Add file button */}
                    <Pressable
                        onPress={() => addFileFromDevice()}
                        className="mr-2 rounded-md bg-blue-500 px-3 py-1">
                        <Text className="text-sm text-white">+ Add</Text>
                    </Pressable>

                    {showTopActions && (
                        <Pressable onPress={() => setTopActionsVisible(true)} className="mr-2 p-2">
                            <Text className="text-2xl text-gray-600">⋮</Text>
                        </Pressable>
                    )}

                    {/* select all / clear */}
                    {allowMultiSelect && (
                        <Pressable
                            onPress={() => {
                                if (selectedUris.size === files.length) clearSelection();
                                else setSelectedUris(new Set(files.map((f) => f.uri)));
                            }}
                            className="rounded-md bg-gray-100 px-3 py-1">
                            <Text className="text-sm text-gray-700">
                                {selectedUris.size === files.length ? 'Clear' : 'Select all'}
                            </Text>
                        </Pressable>
                    )}
                </View>
            </View>

            {/* content */}
            <View className="flex-1 p-3">
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator />
                    </View>
                ) : files.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-gray-500">{emptyMessage}</Text>
                    </View>
                ) : (
                    <FlatList
                        data={files}
                        keyExtractor={(i) => i.uri}
                        renderItem={renderFileRow}
                        contentContainerStyle={{ paddingBottom: 120 }}
                    />
                )}
            </View>

            {/* bottom action bar (shows when selection exists or always show small bar) */}
            <View className="absolute bottom-6 left-4 right-4 flex-row items-center justify-between rounded-xl bg-white p-3 shadow-lg">
                <Text className="text-sm text-gray-700">{selectedUris.size} selected</Text>
                <View className="flex-row items-center">
                    <Pressable className="mr-2 px-3 py-1" onPress={() => handleOpenSelected()}>
                        <Text
                            className={`font-semibold text-sm ${
                                selectedUris.size ? 'text-blue-600' : 'text-gray-300'
                            }`}>
                            Open
                        </Text>
                    </Pressable>

                    <Pressable className="mr-2 px-3 py-1" onPress={() => shareSelected()}>
                        <Text
                            className={`font-semibold text-sm ${
                                selectedUris.size ? 'text-green-600' : 'text-gray-300'
                            }`}>
                            Share
                        </Text>
                    </Pressable>

                    <Pressable
                        className="rounded-md bg-red-600 px-3 py-1"
                        onPress={() => deleteSelected()}>
                        <Text className="font-semibold text-sm text-white">Delete</Text>
                    </Pressable>
                </View>
            </View>

            {/* Top actions modal (dotted button) */}
            <Modal
                transparent
                visible={topActionsVisible}
                animationType="fade"
                onRequestClose={() => setTopActionsVisible(false)}>
                <Pressable
                    className="flex-1 bg-black/40"
                    onPress={() => setTopActionsVisible(false)}>
                    <View className="absolute right-4 top-16 w-48 rounded-lg bg-white p-2 shadow-lg">
                        {mergedTopActions.map((a) => (
                            <Pressable
                                key={a.id}
                                onPress={() => {
                                    a.handler(files.filter((f) => selectedUris.has(f.uri)));
                                    setTopActionsVisible(false);
                                }}
                                className="p-2">
                                <Text className="text-gray-800">{a.label}</Text>
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
            </Modal>

            {/* per-file action modal */}
            <Modal
                transparent
                visible={actionModalVisible}
                animationType="slide"
                onRequestClose={() => setActionModalVisible(false)}>
                <Pressable
                    className="flex-1 bg-black/40"
                    onPress={() => setActionModalVisible(false)}>
                    <View className="absolute bottom-12 left-4 right-4 rounded-lg bg-white p-4 shadow-lg">
                        <Text className="mb-2 font-semibold text-lg">Actions</Text>
                        <Pressable
                            className="p-3"
                            onPress={() => {
                                if (targetFileActions) openFile(targetFileActions);
                                setActionModalVisible(false);
                            }}>
                            <Text>Open</Text>
                        </Pressable>

                        <Pressable
                            className="p-3"
                            onPress={() => {
                                if (targetFileActions) deleteFiles([targetFileActions]);
                                setActionModalVisible(false);
                            }}>
                            <Text className="text-red-600">Delete</Text>
                        </Pressable>

                        {extraActions.map((a) => (
                            <Pressable
                                key={a.id}
                                className="p-3"
                                onPress={() => {
                                    if (targetFileActions) a.handler([targetFileActions]);
                                    setActionModalVisible(false);
                                }}>
                                <Text>{a.label}</Text>
                            </Pressable>
                        ))}

                        <Pressable className="p-3" onPress={() => setActionModalVisible(false)}>
                            <Text className="text-gray-500">Cancel</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>

            {/* Importing overlay */}
            {importing && (
                <View className="absolute inset-0 items-center justify-center bg-black/30">
                    <View className="rounded-lg bg-white p-4">
                        <ActivityIndicator />
                        <Text className="mt-2">Importing file...</Text>
                    </View>
                </View>
            )}
        </View>
    );

    // helper: open for selected
    async function handleOpenSelected() {
        const selected = files.filter((f) => selectedUris.has(f.uri));
        if (!selected.length) return;
        // if multi-select allowed but only single open supported, open first
        await openFile(selected[0]);
        clearSelection();
    }

    // Adds file from device storage into the target directory
    async function addFileFromDevice() {
        try {
            setImporting(true);
            // Ask user to pick any document
            const res = await DocumentPicker.getDocumentAsync({
                copyToCacheDirectory: true, // ensure a file:// uri on all platforms
                multiple: false,
            });

            if (res.canceled) {
                return;
            }

            const asset = res.assets[0];
            const pickedUri = asset.uri;
            // fallback name: use res.name or derive from uri
            let filename = asset.name;

            // ensure directory path ends with slash
            const dirPath = directory.endsWith('/') ? directory : directory + '/';
            // destination full path
            let destUri = dirPath + filename;

            // handle name collisions: if exists, append suffix _1, _2...
            let counter = 1;
            while ((await FileSystem.getInfoAsync(destUri)).exists) {
                // generate a new name with suffix
                const parts = filename.split('.');
                if (parts.length > 1) {
                    const ext = parts.pop();
                    const base = parts.join('.');
                    filename = `${base}_${counter}.${ext}`;
                } else {
                    filename = `${filename}_${counter}`;
                }
                destUri = dirPath + filename;
                counter++;
            }

            // Try copying first (works on file:// URIs). If fails, fall back to downloadAsync
            try {
                await FileSystem.copyAsync({ from: pickedUri, to: destUri });
            } catch (copyErr) {
                console.log('copyAsync failed, trying downloadAsync', copyErr);
                try {
                    // downloadAsync will work with content:// URIs on Android and http(s)
                    await FileSystem.downloadAsync(pickedUri, destUri);
                } catch (downloadErr) {
                    console.log('downloadAsync also failed', downloadErr);
                    throw new Error('Could not import file from the selected source.');
                }
            }

            // refresh file list
            await listFiles();
            Alert.alert('Success', `Imported "${filename}"`);
        } catch (err: any) {
            console.log('addFileFromDevice error', err);
            Alert.alert('Import failed', err?.message ?? 'Failed to import file');
        } finally {
            setImporting(false);
        }
    }
}
