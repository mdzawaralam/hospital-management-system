
import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';

const menusByRole = {
    ADMIN: [
        {
            label: 'Doctor',
            icon: '🩺',
            children: [
                { label: 'Doctor Registration', path: '/admin/doctors/register' },
                { label: 'Doctor List', path: '/admin/doctors' },
            ],
        },
        {
            label: 'Receptionist',
            icon: '👥',
            children: [
                { label: 'Receptionist Registration', path: '/admin/receptionists/register' },
                { label: 'Receptionist List', path: '/admin/receptionists' },
            ],
        },
        {
            label: 'Patient',
            icon: '🧑',
            children: [
                { label: 'Patient Registration', path: '/admin/patients/register' },
                { label: 'Patient List', path: '/admin/patients' },
            ],
        },
    ],

    DOCTOR: [
        { label: 'Appointments', path: '/doctor/appointments', icon: '📅' },
        { label: 'My Patients', path: '/doctor/patients', icon: '🧑' },
        { label: 'My Profile', path: '/doctor/profile', icon: '👤' },
    ],

    RECEPTIONIST: [
        { label: 'Available Doctors', path: '/receptionist/doctors', icon: '🩺' },
        { label: 'Patient Registration', path: '/receptionist/patients/register', icon: '🧑' },
        { label: 'Patient List', path: '/receptionist/patients', icon: '📋' },
    ],

    PATIENT: [
        { label: 'My Profile', path: '/patient/profile', icon: '👤' },
        { label: 'My Appointments', path: '/patient/appointments', icon: '📅' },
        { label: 'Treatment History', path: '/patient/treatments', icon: '📋' },
    ],
};

const roleLabels = {
    ADMIN: 'Administrator',
    DOCTOR: 'Doctor',
    RECEPTIONIST: 'Receptionist',
    PATIENT: 'Patient',
};

function normalizeRole(user) {
    const value = user?.role?.roleName ?? user?.role ?? '';
    return String(value)
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s-]+/g, '_')
        .toUpperCase();
}

function SidebarLink({ to, children }) {
    return (
        <NavLink
            to={to}
            end
            className={({ isActive }) =>
                `block rounded-lg px-3 py-2.5 text-sm transition ${isActive
                    ? 'bg-blue-600 font-semibold text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
            }
        >
            {children}
        </NavLink>
    );
}

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState({
        Doctor: true,
        Receptionist: true,
        Patient: true,
    });

    const role = normalizeRole(user);
    const menuItems = menusByRole[role] ?? [];

    function handleLogout() {
        logout();
        navigate('/login', { replace: true });
    }

    function toggleMenu(label) {
        setOpenMenus((previous) => ({
            ...previous,
            [label]: !previous[label],
        }));
    }

    return (
        <div className="flex min-h-screen bg-slate-100">
            <aside className="flex w-64 shrink-0 flex-col bg-slate-900 text-white">
                <div className="border-b border-slate-700 px-5 py-6">
                    <h1 className="text-xl font-bold">Hospital Management</h1>
                    <p className="mt-1 text-sm text-slate-400">
                        {roleLabels[role] ?? 'Portal'}
                    </p>
                </div>

                <nav className="flex-1 space-y-2 p-4">
                    <SidebarLink to={`/${role.toLowerCase()}`}>
                        <span className="mr-2">▦</span>
                        Dashboard
                    </SidebarLink>

                    {menuItems.map((item) => {
                        if (item.children) {
                            const isCurrentGroup = item.children.some(
                                (child) => location.pathname === child.path
                            );
                            const isOpen = openMenus[item.label] || isCurrentGroup;

                            return (
                                <div key={item.label}>
                                    <button
                                        type="button"
                                        onClick={() => toggleMenu(item.label)}
                                        aria-expanded={Boolean(isOpen)}
                                        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 hover:bg-slate-800"
                                    >
                                        <span>
                                            <span className="mr-2">{item.icon}</span>
                                            {item.label}
                                        </span>
                                        <span>{isOpen ? '▾' : '▸'}</span>
                                    </button>

                                    {isOpen && (
                                        <div className="ml-4 mt-1 space-y-1 border-l border-slate-700 pl-3">
                                            {item.children.map((child) => (
                                                <SidebarLink key={child.path} to={child.path}>
                                                    {child.label}
                                                </SidebarLink>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <SidebarLink key={item.path} to={item.path}>
                                <span className="mr-2">{item.icon}</span>
                                {item.label}
                            </SidebarLink>
                        );
                    })}
                </nav>

                <div className="border-t border-slate-700 p-4">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-red-300 hover:bg-slate-800"
                    >
                        ↪ Logout
                    </button>
                </div>
            </aside>

            <div className="min-w-0 flex-1">
                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">
                            {roleLabels[role]} Dashboard
                        </h2>
                        <p className="text-sm text-slate-500">
                            Hospital administration portal
                        </p>
                    </div>
                    <div className="text-sm text-slate-600">
                        Signed in as{' '}
                        <span className="font-semibold text-slate-900">
                            {user?.fullName ?? user?.name ?? user?.emailAddress ?? roleLabels[role]}
                        </span>
                    </div>
                </header>

                <main className="p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
