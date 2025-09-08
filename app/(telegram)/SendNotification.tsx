import { ScrollView } from 'react-native';
import MovieSeriesNotification from '~/components/Telegram/MovieSeriesNotification';

export default function SendNotification() {
    return (
        <ScrollView className="flex-1">
            <MovieSeriesNotification />
        </ScrollView>
    );
}
