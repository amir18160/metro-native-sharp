import React, { useEffect } from 'react';
import Animated, { FadeInDown, FadeInRight, FadeOutRight } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Toast } from 'toastify-react-native';
import * as FileSystem from 'expo-file-system';
import { folders } from '~/constants/folders';
import { useUploadSubtitleZip } from '~/hooks/services/upload/useUploadSubtitleZip';
import { modal } from '~/stores/useAnimatedModalCenterStore';
import { useAddTaskStore } from '~/stores/useAddTaskStore';
import Modal from '../common/Modal';
import FileManager from '../FileManager/FileManager';

import { Text } from '../nativewindui/Text';
import { AnimatedButton } from '../common/AnimatedButton';
import { AnimatedStatusBox } from '../common/AnimatedStatusBox';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, View } from 'react-native';

export default function SelectSubtitle() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [status, setStatus] = React.useState<'idle' | 'warn' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = React.useState('');

    const router = useRouter();
    const uploadSubtitle = useUploadSubtitleZip();
    const store = useAddTaskStore((state) => state);

    const handleSelectFromStorage = () => {
        setIsModalOpen(true);
    };

    const handleDownloadFromSource = () => {
        router.push('/(browser)/Browser');
    };

    const handleClearSubtitle = () => {
        store.setSubtitleStoredPath(null);
        setStatus('idle');
        setStatusMessage('no subtitle has been set');
        Toast.show({
            type: 'info',
            text1: 'Cleared',
            text2: 'Subtitle selection has been cleared.',
        });
    };

    useEffect(() => {
        if (store.subtitleStoredPath) {
            setStatus('success');
            setStatusMessage('Subtitle Already Exist');
            return;
        }

        setStatus('idle');
        setStatusMessage('No subtitle has been set');
    }, [store.subtitleStoredPath]);

    const hasSubtitle = Boolean(store.subtitleStoredPath);

    return (
        <Animated.View entering={FadeInDown.duration(500)} className="my-6">
            <Text className="mb-3 font-semibold text-xl text-white">Select Subtitle</Text>

            {/* Buttons Row */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row items-center gap-3">
                    <AnimatedButton
                        title="Select From Storage"
                        onPress={handleSelectFromStorage}
                        variant="primary"
                        leftIcon={<Ionicons name="folder-open" size={18} color="white" />}
                    />
                    {hasSubtitle && (
                        <Animated.View entering={FadeInRight} exiting={FadeOutRight}>
                            <Pressable
                                onPress={handleClearSubtitle}
                                className="rounded-xl bg-red-600 p-3 active:bg-red-700">
                                <Ionicons name="trash" size={18} color="white" />
                            </Pressable>
                        </Animated.View>
                    )}

                    <AnimatedButton
                        title="Download"
                        onPress={handleDownloadFromSource}
                        loadingPosition="left"
                        color="#0ea5e9"
                        textColor="text-white"
                        rightIcon={<Ionicons name="cloud-upload" size={18} color="white" />}
                    />
                </View>
            </ScrollView>

            {/* Status Box */}
            <AnimatedStatusBox status={status} message={statusMessage} className="mt-4" />

            {/* File Picker Modal */}
            <Modal
                scrollable={false}
                onClose={() => setIsModalOpen(false)}
                visible={isModalOpen}
                title="Select Subtitle">
                <FileManager
                    directory={FileSystem.documentDirectory! + folders.subtitles}
                    onOpen={(fileEntry) => {
                        setStatusMessage('Uploading subtitle...');

                        uploadSubtitle.mutate(
                            { file: fileEntry },
                            {
                                onSuccess: (data) => {
                                    setIsModalOpen(false);
                                    store.setSubtitleStoredPath(data.data!.filePath);
                                    setStatus('success');
                                    setStatusMessage('Subtitle uploaded successfully!');
                                    Toast.show({
                                        type: 'success',
                                        text1: 'موفق',
                                        text2: 'فایل زیرنویس با موفقیت انتخاب شد.',
                                    });
                                },
                                onError: () => {
                                    setStatus('error');
                                    setStatusMessage('Failed to upload subtitle.');
                                },
                                onSettled: () => {
                                    modal.hide();
                                },
                            }
                        );

                        modal.loading({
                            bindTo: () => uploadSubtitle.isPending,
                            message: 'در حال آپلود فایل',
                        });
                    }}
                />
            </Modal>
        </Animated.View>
    );
}
