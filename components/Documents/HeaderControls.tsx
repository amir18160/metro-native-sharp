// HeaderControls.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { DocumentType } from '~/types/server/documents/document-dto';
import { SearchableMediaList } from '../common/SearchableMediaList';
import Modal from '../common/Modal';
import { useGetTMDbMovieDetails } from '~/hooks/services/tmdb/useGetTMDbMovieDetails';
import { useGetTMDbShowDetails } from '~/hooks/services/tmdb/useGetTMDbShowDetails';
import { TMDbMedia } from '~/types/server/tmdb/tm-db-media';
import { MediaType } from '~/types/server/tmdb/media-type';
import { modal } from '~/stores/useAnimatedModalCenterStore';

type HeaderControlsProps = {
    imdbId: string;
    setImdbId: (v: string) => void;
    type: DocumentType;
    setType: (t: DocumentType) => void;
    season: string;
    setSeason: (v: string) => void;
};

export default function HeaderControls({
    imdbId,
    setImdbId,
    type,
    setType,
    season,
    setSeason,
}: HeaderControlsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const movieDetails = useGetTMDbMovieDetails();
    const tvDetails = useGetTMDbShowDetails();

    function handleError(message: string) {
        modal.error({
            title: 'خطا',
            message: message,
        });
    }

    function handleSuccess(imdbId?: string) {
        if (imdbId) {
            setImdbId(imdbId);
            setIsModalOpen(false);
        } else {
            handleError('رکب خوردیم باز');
        }
    }

    function onSelect(media: TMDbMedia) {
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
        <View className="mb-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <Text className="text-xs text-gray-500">IMDB ID (applies to all)</Text>
            <Pressable onPress={() => setIsModalOpen(true)}>
                <TextInput
                    value={imdbId}
                    onChangeText={setImdbId}
                    placeholder="tt1234567"
                    className="mt-1 rounded border border-gray-200 px-3 py-2"
                    editable={false}
                />
            </Pressable>

            <View className="mt-3 flex-row items-center">
                <Text className="mr-2 text-xs text-gray-500">Type</Text>
                <TouchableOpacity
                    onPress={() => setType(DocumentType.Movie)}
                    className={`rounded px-3 py-1 ${type === DocumentType.Movie ? 'bg-amber-100' : 'bg-gray-100'} mr-2`}>
                    <Text className="text-sm">Movie</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setType(DocumentType.Episode)}
                    className={`rounded px-3 py-1 ${type === DocumentType.Episode ? 'bg-emerald-100' : 'bg-gray-100'} mr-2`}>
                    <Text className="text-sm">Episode</Text>
                </TouchableOpacity>

                {type === DocumentType.Episode && (
                    <TextInput
                        value={season}
                        onChangeText={setSeason}
                        placeholder="Season #"
                        keyboardType="number-pad"
                        className="ml-auto w-28 rounded border border-gray-200 px-2 py-1 text-sm"
                    />
                )}
            </View>
            <Modal
                title="Select Media"
                visible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                scrollable={false}>
                <SearchableMediaList onSelect={onSelect} />
            </Modal>
        </View>
    );
}
