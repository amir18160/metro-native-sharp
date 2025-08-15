import { useEffect } from 'react';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withSpring,
} from 'react-native-reanimated';
import { useAddTaskStore } from '~/stores/useAddTaskStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AnimatedTextField from '../common/AnimatedTextField';

interface IProps {
    error?: string;
}

export default function ImdbField({ error }: IProps) {
    const taskStore = useAddTaskStore();

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

    return (
        <Animated.View style={containerStyle} className="mt-4 w-full">
            <AnimatedTextField
                variant="default"
                label="ImdbId"
                value={taskStore.imdbId ?? ''}
                onChangeText={(value) => taskStore.setImdbId(value)}
                placeholder="ex: tt1234567"
                iconLeft={<MaterialCommunityIcons name="movie-open-play" size={20} color="white" />}
                showPasteButton
                required
                errorMessage={error}
            />
        </Animated.View>
    );
}
