
import { createBrowserRouter, Navigate } from 'react-router-dom';

import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import ProtectedRoute from './ProtectedRoute';
import DashboardRedirect from './DashboardRedirect';

import DashboardLayout from '../components/layout/DashboardLayout';

import AdminDashboard from '../features/admin/pages/AdminDashboard';
import DoctorDashboard from '../features/doctor/pages/DoctorDashboard';
import ReceptionistDashboard from '../features/receptionist/pages/ReceptionistDashboard';
import PatientDashboard from '../features/patient/pages/PatientDashboard';

import { useAuth } from '../features/auth/context/AuthContext';

function HomeRedirect() {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const roleValue = user?.role?.roleName ?? user?.role;
    const role = String(roleValue ?? '')
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s-]+/g, '_')
        .toUpperCase();

    const dashboardPaths = {
        ADMIN: '/admin',
        DOCTOR: '/doctor',
        RECEPTIONIST: '/receptionist',
        PATIENT: '/patient',
    };

    return (
        <Navigate
            to={dashboardPaths[role] ?? '/login'}
            replace
        />
    );
}

function AdminPagePlaceholder({ title }) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="mt-2 text-slate-600">
                This page will be implemented next.
            </p>
        </section>
    );
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
        path: '/dashboard',
        element: <DashboardRedirect />,
    },

    // ADMIN ROUTES
    {
        element: <ProtectedRoute allowedRoles={['Admin']} />,
        children: [
            {
                path: '/admin',
                element: <DashboardLayout />,
                children: [
                    {
                        index: true,
                        element: <AdminDashboard />,
                    },
                    {
                        path: 'doctors/register',
                        element: <AdminPagePlaceholder title="Doctor Registration" />,
                    },
                    {
                        path: 'doctors',
                        element: <AdminPagePlaceholder title="Doctor List" />,
                    },
                    {
                        path: 'receptionists/register',
                        element: (
                            <AdminPagePlaceholder title="Receptionist Registration" />
                        ),
                    },
                    {
                        path: 'receptionists',
                        element: <AdminPagePlaceholder title="Receptionist List" />,
                    },
                    {
                        path: 'patients/register',
                        element: <AdminPagePlaceholder title="Patient Registration" />,
                    },
                    {
                        path: 'patients',
                        element: <AdminPagePlaceholder title="Patient List" />,
                    },
                ],
            },
        ],
    },

    // DOCTOR ROUTES
    {
        element: <ProtectedRoute allowedRoles={['Doctor']} />,
        children: [
            {
                path: '/doctor',
                element: <DashboardLayout />,
                children: [
                    { index: true, element: <DoctorDashboard /> },
                    {
                        path: 'appointments',
                        element: <AdminPagePlaceholder title="My Appointments" />,
                    },
                    {
                        path: 'patients',
                        element: <AdminPagePlaceholder title="My Patients" />,
                    },
                    {
                        path: 'profile',
                        element: <AdminPagePlaceholder title="My Profile" />,
                    },
                ],
            },
        ],
    },

    // RECEPTIONIST ROUTES
    {
        element: <ProtectedRoute allowedRoles={['Receptionist']} />,
        children: [
            {
                path: '/receptionist',
                element: <DashboardLayout />,
                children: [
                    { index: true, element: <ReceptionistDashboard /> },
                    {
                        path: 'doctors',
                        element: <AdminPagePlaceholder title="Available Doctors" />,
                    },
                    {
                        path: 'patients/register',
                        element: <AdminPagePlaceholder title="Patient Registration" />,
                    },
                    {
                        path: 'patients',
                        element: <AdminPagePlaceholder title="Patient List" />,
                    },
                ],
            },
        ],
    },

    // PATIENT ROUTES
    {
        element: <ProtectedRoute allowedRoles={['Patient']} />,
        children: [
            {
                path: '/patient',
                element: <DashboardLayout />,
                children: [
                    { index: true, element: <PatientDashboard /> },
                    {
                        path: 'profile',
                        element: <AdminPagePlaceholder title="My Profile" />,
                    },
                    {
                        path: 'appointments',
                        element: <AdminPagePlaceholder title="My Appointments" />,
                    },
                    {
                        path: 'treatments',
                        element: <AdminPagePlaceholder title="Treatment History" />,
                    },
                ],
            },
        ],
    },
]);
