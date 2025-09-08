import axios, { AxiosError } from 'axios';
import { modal } from '~/stores/useAnimatedModalCenterStore';
import { useApplicationSettingsStore } from '~/stores/useApplicationSettingsStore';
import { useUserStore } from '~/stores/useUserStore';

const apiClient = axios.create();

// Add a request interceptor
apiClient.interceptors.request.use(
    async (config) => {
        const apiURL = useApplicationSettingsStore.getState().serverURL;

        config.baseURL = apiURL;

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
        if (process.env.EXPO_PUBLIC_NODE_ENV === 'development' && error.response?.data) {
            console.error(JSON.stringify(error.response?.data, null, 2));
        }

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
