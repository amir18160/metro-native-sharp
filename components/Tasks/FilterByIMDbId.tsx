import { useState } from 'react';
import { useGetTMDbMovieDetails } from '~/hooks/services/tmdb/useGetTMDbMovieDetails';
import { useGetTMDbShowDetails } from '~/hooks/services/tmdb/useGetTMDbShowDetails';
import { Toast } from 'toastify-react-native';
import { TMDbMedia } from '~/types/server/tmdb/tm-db-media';
import { MediaType } from '~/types/server/tmdb/media-type';
import Modal from '../common/Modal';
import { SearchableMediaList } from '../common/SearchableMediaList';
import { Pressable, View } from 'react-native';
import AnimatedTextField from '../common/AnimatedTextField';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

interface IProps {
    imdbId?: string;
    setImdbId: (imdbId: string) => void;
}

export default function FilterByIMDbId({ setImdbId, imdbId }: IProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const movieDetails = useGetTMDbMovieDetails();
    const tvDetails = useGetTMDbShowDetails();

    function handleError(message: string) {
        Toast.error(message);
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
        <View className="flex-1">
            <AnimatedTextField
                labelColor="text-base text-black dark:text-white"
                label="IMDb ID"
                iconLeft={<FontAwesome name="imdb" size={24} color="#f5c518" />}
                iconRight={
                    <Pressable onPress={() => setIsModalOpen(true)}>
                        <MaterialCommunityIcons name="magnify" size={24} color="#f5c518" />
                    </Pressable>
                }
                size="sm"
                placeholder="IMDb ID"
                value={imdbId || ''}
                onChangeText={(text) => setImdbId(text)}
            />

            <Modal
                onClose={() => setIsModalOpen(false)}
                title="Select Media"
                visible={isModalOpen}
                scrollable={false}>
                <SearchableMediaList onSelect={onSelect} />
            </Modal>
        </View>
    );
}
