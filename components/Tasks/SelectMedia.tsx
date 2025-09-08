import { View, Pressable } from 'react-native';
import React, { useState } from 'react';
import { useAddTaskStore } from '~/stores/useAddTaskStore';
import { useGetTMDbMovieDetails } from '~/hooks/services/tmdb/useGetTMDbMovieDetails';
import { useGetTMDbShowDetails } from '~/hooks/services/tmdb/useGetTMDbShowDetails';
import Modal from '../common/Modal';
import { SearchableMediaList } from '../common/SearchableMediaList';
import { TMDbMedia } from '~/types/server/tmdb/tm-db-media';
import { MediaType } from '~/types/server/tmdb/media-type';
import { SelectedMediaDetailsCard } from './SelectedMediaDetailsCard';
import { modal } from '~/stores/useAnimatedModalCenterStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SelectMedia() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const store = useAddTaskStore();

    const movieDetails = useGetTMDbMovieDetails();
    const tvDetails = useGetTMDbShowDetails();

    function handleError(message: string) {
        modal.error({ title: 'خطا', message });
    }

    function handleSuccess(imdbId?: string) {
        if (imdbId) {
            store.setImdbId(imdbId);
            setIsModalOpen(false);
        } else {
            handleError('رکب خوردیم باز');
        }
    }

    function onSelect(media: TMDbMedia) {
        store.setMedia(media);

        if (media.mediaType === MediaType.Movie) {
            movieDetails.mutate(
                { id: media.id, IncludeExternalIds: true },
                {
                    onSuccess: (res) => handleSuccess(res?.data?.imdbId),
                    onError: () => handleError('خطا در دریافت اطلاعات فیلم'),
                }
            );
        } else if (media.mediaType === MediaType.Tv) {
            tvDetails.mutate(
                { id: media.id, IncludeExternalIds: true },
                {
                    onSuccess: (res) => handleSuccess(res?.data?.externalIds?.imdbId),
                    onError: () => handleError('خطا در دریافت اطلاعات سریال'),
                }
            );
        }
    }

    return (
        <View>
            <View>
                <Modal
                    onClose={() => setIsModalOpen(false)}
                    title="Select Media"
                    visible={isModalOpen}
                    scrollable={false}>
                    <SafeAreaView className="flex-1">
                        <SearchableMediaList onSelect={onSelect} />
                    </SafeAreaView>
                </Modal>
            </View>

            <Pressable onPress={() => setIsModalOpen(true)}>
                <View className="my-6">
                    <SelectedMediaDetailsCard
                        data={
                            store.media?.mediaType === MediaType.Movie
                                ? movieDetails.data?.data
                                : tvDetails.data?.data
                        }
                        storedMovieName={
                            store.media?.title && store.imdbId ? store.media.title : undefined
                        }
                        type={store.media?.mediaType === MediaType.Movie ? 'movie' : 'tv'}
                        onPress={() => setIsModalOpen(true)}
                    />
                </View>
            </Pressable>
        </View>
    );
}
