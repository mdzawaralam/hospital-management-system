
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//import api from '../api/axios';
import AuthLayout from '../../../components/AuthLayout';

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: '',
        emailAddress: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            // This endpoint must be implemented in the backend
            // or replaced with your existing authorized registration route.
            /*    await api.post('/api/auth/register', {
                   fullName: form.fullName,
                   emailAddress: form.emailAddress,
                   password: form.password,
               }); */

            navigate('/login', {
                state: { message: 'Registration successful. Please sign in.' },
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Registration failed. Please verify the registration API.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Create an account"
            subtitle="Register your patient account."
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Full name
                    </label>

                    <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        required
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Email address
                    </label>

                    <input
                        type="email"
                        name="emailAddress"
                        value={form.emailAddress}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
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
                        placeholder="Create a password"
                        autoComplete="new-password"
                        minLength={8}
                        required
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Confirm password
                    </label>

                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        minLength={8}
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
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? 'Creating account...' : 'Register'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
                Already registered?{' '}
                <Link
                    to="/login"
                    className="font-semibold text-blue-600 hover:text-blue-700"
                >
                    Sign in
                </Link>
            </p>
        </AuthLayout>
    );
}
