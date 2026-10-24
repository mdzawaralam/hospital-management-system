
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const role = user?.role;

    // Check whether the logged-in user's role is allowed.
    if (!allowedRoles?.includes(role)) {
        // Prevent redirecting back into a possible route loop.
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
