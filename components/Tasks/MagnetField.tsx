import React, { useEffect, useState } from 'react';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withSpring,
} from 'react-native-reanimated';
import { useAddTaskStore } from '~/stores/useAddTaskStore';
import { Ionicons } from '@expo/vector-icons';
import AnimatedTextField from '../common/AnimatedTextField';
import TorrentSearchModal from '../TorrentSearch/TorrentSearchModal';
import { useShallow } from 'zustand/shallow';
import { TorrentSearchTerms } from '~/app/(torrentSearch)/TorrentSearch';
import { TorrentSearchSource } from '~/types/local/torrentSearchSource';
import { Pressable } from 'react-native';

interface IProps {
    error?: string;
}
export default function MagnetField({ error }: IProps) {
    const [imdbId, magnet, setMagnet] = useAddTaskStore(
        useShallow((state) => [state.imdbId, state.magnet, state.setMagnet])
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerms, setSearchTerms] = useState<TorrentSearchTerms>({
        query: imdbId ?? '',
        searchSource: TorrentSearchSource.Indexer,
    });

    useEffect(() => setSearchTerms((prev) => ({ ...prev, query: imdbId ?? '' })), [imdbId]);

    // Animation values
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(20);

    useEffect(() => {
        // Animate field into view
        opacity.value = withTiming(1, { duration: 500 });
        translateY.value = withSpring(0, { damping: 12 });
    }, [opacity, translateY]);

    const containerStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    const onSelect = (magnet: string) => {
        setMagnet(magnet);
        setIsModalOpen(false);
    };

    const renderButton = () => {
        return (
            <Pressable onPress={() => setIsModalOpen(true)}>
                <Ionicons
                    name="open"
                    size={20}
                    color="white"
                    className="rounded-full bg-indigo-500 p-1.5"
                />
            </Pressable>
        );
    };

    return (
        <Animated.View style={containerStyle} className="mt-4 w-full">
            <AnimatedTextField
                variant="magnet"
                value={magnet ?? ''}
                onChangeText={(value) => setMagnet(value)}
                placeholder="magnet:?xt"
                iconLeft={<Ionicons name="link" size={20} color="white" />}
                iconRight={renderButton()}
                showPasteButton
                required
                errorMessage={error}
            />

            <TorrentSearchModal
                isVisible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                searchTerms={searchTerms}
                setSearchTerms={setSearchTerms}
                onSelect={onSelect}
            />
        </Animated.View>
    );
}
