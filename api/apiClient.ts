import axios, { AxiosError } from 'axios';
import { API_URL } from '~/constants/urls';
import { modal } from '~/stores/useAnimatedModalCenterStore';
import { useUserStore } from '~/stores/useUserStore';

const apiClient = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor
apiClient.interceptors.request.use(
    async (config) => {
        const user = useUserStore.getState().getUser();
        const token = user?.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (config) => config,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            const requestUrl = error.config?.url || '';
            const isAuthRoute =
                requestUrl.includes('/account/login') || requestUrl.includes('/account/register');

            if (!isAuthRoute) {
                const user = useUserStore.getState().user;
                if (user) {
                    useUserStore.getState().clearUser();
                }
                modal.error({ message: 'Session expired. Please log in again.' });
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
