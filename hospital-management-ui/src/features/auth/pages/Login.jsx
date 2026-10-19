
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login, loading } = useAuth();

    const [form, setForm] = useState({
        emailAddress: '',
        password: '',
    });

    const [error, setError] = useState('');

    function handleChange(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');

        try {
            await login(form);
            navigate('/dashboard', { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                'Login failed. Please check your credentials.'
            );
        }
    }

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to access your hospital account."
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Email address
                    </label>

                    <input
                        type="email"
                        name="emailAddress"
                        value={form.emailAddress}
                        onChange={handleChange}
                        autoComplete="username"
                        placeholder="you@example.com"
                        required
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Password
                    </label>

                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        required
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {error && (
                    <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
                New patient?{' '}
                <Link
                    to="/register"
                    className="font-semibold text-blue-600 hover:text-blue-700"
                >
                    Register here
                </Link>
            </p>
        </AuthLayout>
    );
}
