import { useMutation } from '@tanstack/react-query';
import { getTvShowDetails } from '~/services/remote/tmdbService';

export const useGetTMDbShowDetails = () => {
    return useMutation({
        mutationFn: getTvShowDetails,
    });
};
