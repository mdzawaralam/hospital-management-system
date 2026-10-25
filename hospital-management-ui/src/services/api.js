import axios from 'axios';

const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_BASE_URL ||
        'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach the access token to each request.
api.interceptors.request.use(
    (config) => {
        const accessToken = sessionStorage.getItem('accessToken');

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Handle expired or invalid sessions centrally.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const requestUrl = error.config?.url || '';

        const isLoginRequest =
            /\/auth\/login(?:\?|$)/.test(requestUrl);

        const isRefreshRequest =
            /\/auth\/refresh(?:\?|$)/.test(requestUrl);

        if (
            status === 401 &&
            !isLoginRequest &&
            !isRefreshRequest
        ) {
            // Clear the complete local session.
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
            sessionStorage.removeItem('user');

            // Avoid repeatedly redirecting from the login page.
            if (window.location.pathname !== '/login') {
                window.location.replace('/login');
            }
        }

        return Promise.reject(error);
    }
);

export default api;
