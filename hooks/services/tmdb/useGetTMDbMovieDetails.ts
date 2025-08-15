import { useMutation } from '@tanstack/react-query';
import { getMovieDetails } from '~/services/remote/tmdbService';

export const useGetTMDbMovieDetails = () => {
    return useMutation({
        mutationFn: getMovieDetails,
    });
};
