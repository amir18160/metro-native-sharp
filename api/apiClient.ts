import axios from 'axios';
import { API_URL } from '~/constants/urls';
import { useUserStore } from '~/stores/userUserStore';

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
    // Handle request error
    return Promise.reject(error);
  }
);

export default apiClient;
