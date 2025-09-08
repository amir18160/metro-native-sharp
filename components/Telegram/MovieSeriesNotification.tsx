import { View, Pressable, Switch } from 'react-native';
import { useSendMovieSeriesNotification } from '~/hooks/services/telegram/useSendMovieSeriesNotification';
import { modal } from '~/stores/useAnimatedModalCenterStore';
import { useState } from 'react';
import { IMovieSeriesNotificationType } from '~/types/server/telegram/movie-series-notification';
import SelectOMDbItem from '../OMDb/SelectOMDbItem';
import { OmdbItem } from '~/types/server/omdb/omdb-item';
import OmdbItemPreviewCard from '../OMDb/OmdbItemPreviewCard';
import AnimatedPicker from '../common/AnimatedPicker';
import { IMovieSeriesNotificationParams } from '~/services/remote/telegramService';
import AnimatedTextField from '../common/AnimatedTextField';
import { notificationTypeToString, stringToNotificationType } from '~/utilities/enumConverter';
import { Text } from '../nativewindui/Text';
import SubmitButton from '../common/SubmitButton';

export default function MovieSeriesNotification() {
    const [selectedMedia, setSelectedMedia] = useState<OmdbItem | null>(null);

    const [params, setParams] = useState<IMovieSeriesNotificationParams>({
        imdbId: '',
        notificationType: IMovieSeriesNotificationType.Recommended,
        updateDetails: {
            season: undefined,
            episode: undefined,
            isFullSeason: false,
        },
    });

    const sendNotification = useSendMovieSeriesNotification();

    const onConfirmHandler = () => {
        if (!selectedMedia?.imdbId) {
            modal.error({ message: 'Please select a movie or series first.' });
            return;
        }

        modal.confirm({
            title: 'Send Message To Channel',
            message: 'Are you sure you want to send this message?',
            confirmText: 'Yes, Send Message',
            cancelText: 'No, Cancel',

            onConfirm: () => {
                modal.loading({ message: 'Sending Message...' });
                sendNotification.mutate(
                    {
                        ...params,
                        imdbId: selectedMedia.imdbId,
                    },
                    {
                        onError: (err) => {
                            const message =
                                err instanceof Error ? err.message : 'Something went wrong';
                            modal.hide();
                            modal.error({ message });
                        },
                        onSuccess: () => {
                            modal.hide();
                            modal.success({ message: 'Task added successfully' });
                        },
                    }
                );
            },
            onCancel: () => {},
        });
    };

    return (
        <View className="mx-auto mb-40 w-[95%] gap-3 py-2">
            {/* Select OMDb Item */}
            <SelectOMDbItem
                onSelect={setSelectedMedia}
                value={selectedMedia?.imdbId ?? ''}
                CustomComponentAsButton={({ onPress }) => (
                    <Pressable onPress={onPress}>
                        <OmdbItemPreviewCard item={selectedMedia} showPlot={false} />
                    </Pressable>
                )}
            />
            <View className="flex-row items-center justify-between gap-3">
                <AnimatedPicker
                    className="flex-1"
                    size="sm"
                    label="Notification Type"
                    labelColor="text-base text-black dark:text-white"
                    options={Object.keys(IMovieSeriesNotificationType).filter((k) =>
                        isNaN(Number(k))
                    )}
                    onSelect={(value) =>
                        setParams((prev) => ({
                            ...prev,
                            notificationType: stringToNotificationType(value),
                        }))
                    }
                    selectedValue={notificationTypeToString(params.notificationType)}
                />

                <View className="mt-0.5 flex-row items-center rounded-md bg-black py-0.5">
                    <View>
                        <Text className="px-5 text-white">Is Full Season</Text>
                    </View>
                    <Switch
                        value={params.updateDetails?.isFullSeason ?? false}
                        onValueChange={(val) =>
                            setParams((prev) => ({
                                ...prev,
                                updateDetails: { ...prev.updateDetails, isFullSeason: val },
                            }))
                        }
                    />
                </View>
            </View>
            <View className="flex-row gap-3">
                {/* Season Input */}
                <View className="flex-1">
                    <AnimatedTextField
                        size="sm"
                        placeholder="Season"
                        keyboardType="numeric"
                        value={params.updateDetails?.season?.toString() ?? ''}
                        onChangeText={(text) =>
                            setParams((prev) => ({
                                ...prev,
                                updateDetails: {
                                    ...prev.updateDetails,
                                    season: text ? parseInt(text, 10) : undefined,
                                },
                            }))
                        }
                        label="Season"
                    />
                </View>

                {/* Episode Input */}
                <View className="flex-1">
                    <AnimatedTextField
                        size="sm"
                        placeholder="Episode"
                        keyboardType="numeric"
                        value={params.updateDetails?.episode?.toString() ?? ''}
                        onChangeText={(text) =>
                            setParams((prev) => ({
                                ...prev,
                                updateDetails: {
                                    ...prev.updateDetails,
                                    episode: text ? parseInt(text, 10) : undefined,
                                },
                            }))
                        }
                        label="Episode"
                    />
                </View>
            </View>

            <SubmitButton
                onPress={onConfirmHandler}
                title="Send To Channel"
                isPending={sendNotification.isPending}
            />
        </View>
    );
}
