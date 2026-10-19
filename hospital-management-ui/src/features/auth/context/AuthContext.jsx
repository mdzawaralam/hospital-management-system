
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';

import authService from '../services/authService';

const AuthContext = createContext(null);

function readStoredUser() {
    try {
        return JSON.parse(sessionStorage.getItem('user') || 'null');
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(readStoredUser);

    const [loading, setLoading] = useState(false);

    const login = useCallback(async (credentials) => {
        setLoading(true);

        try {
            const data = await authService.login(credentials);

            const accessToken = data.data.accessToken;
            const refreshToken = data.data.refreshToken;
            const authenticatedUser = data.data.user;
            if (!accessToken || !authenticatedUser) {
                throw new Error(
                    'The login API response is missing the user or access token.'
                );
            }

            sessionStorage.setItem('accessToken', accessToken);

            if (refreshToken) {
                sessionStorage.setItem('refreshToken', refreshToken);
            }

            sessionStorage.setItem(
                'user',
                JSON.stringify(authenticatedUser)
            );

            setUser(authenticatedUser);

            return authenticatedUser;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('user');

        setUser(null);
    }, []);

    const value = useMemo(
        () => ({
            user,
            loading,
            isAuthenticated: Boolean(
                user && sessionStorage.getItem('accessToken')
            ),
            login,
            logout,
        }),
        [user, loading, login, logout]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            'useAuth must be used inside AuthProvider.'
        );
    }

    return context;
}
