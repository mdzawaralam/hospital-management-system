
import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';

export default function DashboardRedirect() {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const roleValue = user?.role?.roleName ?? user?.role;

    const role = String(roleValue ?? '')
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s-]+/g, '_')
        .toUpperCase();

    const dashboardByRole = {
        Admin: '/admin',
        Doctor: '/doctor',
        Receptionist: '/receptionist',
        Patient: '/patient',
    };

    const destination = dashboardByRole[role];

    if (!destination) {
        return <Navigate to="/login" replace />;
    }

    return <Navigate to={destination} replace />;
}
