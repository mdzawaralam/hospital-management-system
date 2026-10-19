
import {
    createBrowserRouter,
    Navigate,
} from 'react-router-dom';

import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import ProtectedRoute from './ProtectedRoute';
import DashboardRedirect from './DashboardRedirect';
import { useAuth } from '../features/auth/context/AuthContext';

function HomeRedirect() {
    const { isAuthenticated } = useAuth();

    return (
        <Navigate
            to={isAuthenticated ? '/dashboard' : '/login'}
            replace
        />
    );
}

function PlaceholderDashboard({ title }) {
    const { user, logout } = useAuth();

    return (
        <main className="min-h-screen bg-slate-100 p-6 sm:p-10">
            <section className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
                <h1 className="text-2xl font-bold text-slate-900">
                    {title}
                </h1>

                <p className="mt-3 text-slate-600">
                    Welcome, {user?.fullName || user?.emailAddress || 'User'}.
                </p>

                <p className="mt-2 text-sm text-slate-500">
                    This dashboard will be developed in the next phase.
                </p>

                <button
                    onClick={logout}
                    className="mt-6 rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
                >
                    Logout
                </button>
            </section>
        </main>
    );
}

function AdminDashboard() {
    return <PlaceholderDashboard title="Admin Dashboard" />;
}

function DoctorDashboard() {
    return <PlaceholderDashboard title="Doctor Dashboard" />;
}

function ReceptionistDashboard() {
    return <PlaceholderDashboard title="Receptionist Dashboard" />;
}

function PatientDashboard() {
    return <PlaceholderDashboard title="Patient Dashboard" />;
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: <HomeRedirect />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/dashboard',
                element: <DashboardRedirect />,
            },
        ],
    },
    {
        element: <ProtectedRoute allowedRoles={['Admin']} />,
        children: [
            { path: '/admin', element: <AdminDashboard /> },
        ],
    },
    {
        element: <ProtectedRoute allowedRoles={['Doctor']} />,
        children: [
            { path: '/doctor', element: <DoctorDashboard /> },
        ],
    },
    {
        element: <ProtectedRoute allowedRoles={['Receptionist']} />,
        children: [
            {
                path: '/receptionist',
                element: <ReceptionistDashboard />,
            },
        ],
    },
    {
        element: <ProtectedRoute allowedRoles={['Patient']} />,
        children: [
            { path: '/patient', element: <PatientDashboard /> },
        ],
    },
]);
