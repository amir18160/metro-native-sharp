import { useMutation } from '@tanstack/react-query';
import { sendMovieSeriesNotificationToChannel } from '~/services/remote/telegramService';

export const useSendMovieSeriesNotification = () => {
    return useMutation({
        mutationFn: sendMovieSeriesNotificationToChannel,
    });
};
