
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="p-6">Checking session...</div>;
    }
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    const role = user?.role?.roleName ?? user?.role;

    // Check whether the logged-in user's role is allowed.
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
