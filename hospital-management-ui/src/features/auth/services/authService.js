import api from '../../../services/api';

const authService = {
    async login(credentials) {
        const response = await api.post(
            '/api/auth/login',
            credentials
        );

        return response.data;
    },

    async register(userData) {
        const response = await api.post(
            '/api/auth/register',
            userData
        );

        return response.data;
    },

    async logout() {
        // The backend logout endpoint can be connected here
        // after we confirm its request and token requirements.
    },
};

export default authService;