import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';

const QUALIFICATION_ENDPOINT = '/api/admin/qualification';
const DOCTOR_ENDPOINT = '/api/admin/doctor';

const initialForm = {
    fullName: '',
    mobileNumber: '',
    emailAddress: '',
    qualificationId: '',
    address: '',
    city: '',
    country: '',
};

function getRows(responseData) {
    if (Array.isArray(responseData)) return responseData;

    const candidates = [
        responseData?.data,
        responseData?.data?.data,
        responseData?.qualifications,
        responseData?.data?.qualifications,
        responseData?.results,
    ];

    return candidates.find(Array.isArray) ?? [];
}

function validateForm(form) {
    const errors = {};

    if (!form.fullName.trim()) {
        errors.fullName = 'Full name is required.';
    } else if (form.fullName.trim().length < 3) {
        errors.fullName = 'Full name must contain at least 3 characters.';
    } else if (form.fullName.trim().length > 100) {
        errors.fullName = 'Full name cannot exceed 100 characters.';
    }

    if (!form.mobileNumber.trim()) {
        errors.mobileNumber = 'Mobile number is required.';
    } else if (!/^\d{10}$/.test(form.mobileNumber.trim())) {
        errors.mobileNumber = 'Enter a valid 10-digit mobile number.';
    }

    if (!form.emailAddress.trim()) {
        errors.emailAddress = 'Email address is required.';
    } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailAddress.trim())
    ) {
        errors.emailAddress = 'Enter a valid email address.';
    }

    if (!form.qualificationId) {
        errors.qualificationId = 'Please select a qualification.';
    } else if (
        !Number.isInteger(Number(form.qualificationId)) ||
        Number(form.qualificationId) <= 0
    ) {
        errors.qualificationId = 'Select a valid qualification.';
    }

    if (!form.address.trim()) {
        errors.address = 'Address is required.';
    }

    if (!form.city.trim()) {
        errors.city = 'City is required.';
    }

    if (!form.country.trim()) {
        errors.country = 'Country is required.';
    }

    return errors;
}

function Field({
    label,
    name,
    value,
    onChange,
    error,
    placeholder,
    type = 'text',
    maxLength,
    autoComplete,
}) {
    const inputId = `doctor-${name}`;

    return (
        <div>
            <label
                htmlFor={inputId}
                className="mb-2 block text-sm font-medium text-slate-700"
            >
                {label} <span className="text-red-500">*</span>
            </label>

            <input
                id={inputId}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                autoComplete={autoComplete}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${inputId}-error` : undefined}
                className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${error
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                    }`}
            />

            {error && (
                <p
                    id={`${inputId}-error`}
                    className="mt-1.5 text-sm text-red-600"
                >
                    {error}
                </p>
            )}
        </div>
    );
}

export default function DoctorRegistration() {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [qualifications, setQualifications] = useState([]);
    const [qualificationLoading, setQualificationLoading] = useState(true);
    const [qualificationError, setQualificationError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [apiError, setApiError] = useState('');

    useEffect(() => {
        let isMounted = true;

        async function loadQualifications() {
            setQualificationLoading(true);
            setQualificationError('');

            try {
                const response = await api.get(QUALIFICATION_ENDPOINT);
                const rows = getRows(response.data);

                if (isMounted) {
                    setQualifications(rows);

                    if (rows.length === 0) {
                        setQualificationError(
                            'No qualifications were returned by the API.'
                        );
                    }
                }
            } catch (error) {
                if (isMounted) {
                    setQualificationError(
                        error?.response?.data?.message ||
                        'Could not load qualifications. Please check the qualification API.'
                    );
                }
            } finally {
                if (isMounted) {
                    setQualificationLoading(false);
                }
            }
        }

        loadQualifications();

        return () => {
            isMounted = false;
        };
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]:
                name === 'mobileNumber'
                    ? value.replace(/\D/g, '').slice(0, 10)
                    : value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: undefined,
        }));

        setSuccessMessage('');
        setApiError('');
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSuccessMessage('');
        setApiError('');

        const validationErrors = validateForm(form);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        const payload = {
            fullName: form.fullName.trim(),
            mobileNumber: form.mobileNumber.trim(),
            emailAddress: form.emailAddress.trim(),
            qualificationId: Number(form.qualificationId),
            address: form.address.trim(),
            city: form.city.trim(),
            country: form.country.trim(),
        };

        setSubmitting(true);

        try {
            const response = await api.post(DOCTOR_ENDPOINT, payload);

            setSuccessMessage(
                response?.data?.message ||
                'Doctor registered successfully.'
            );

            setForm(initialForm);
            setErrors({});
        } catch (error) {
            setApiError(
                error?.response?.data?.message ||
                'Doctor registration failed. Please check the details and try again.'
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-6">
                <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    <span aria-hidden="true">←</span>
                    Back to Admin Dashboard
                </Link>

                <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Doctor Registration
                </h1>

                <p className="mt-2 text-sm text-slate-600">
                    Enter the doctor's personal and qualification details.
                    All fields are required.
                </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 sm:px-8">
                    <h2 className="font-semibold text-slate-900">
                        Doctor Information
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Please verify the details before submitting.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-6 p-6 sm:p-8"
                >
                    {successMessage && (
                        <div
                            role="status"
                            className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
                        >
                            <p className="font-semibold">
                                Registration successful
                            </p>
                            <p className="mt-1">{successMessage}</p>
                        </div>
                    )}

                    {apiError && (
                        <div
                            role="alert"
                            className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                        >
                            <p className="font-semibold">
                                Registration failed
                            </p>
                            <p className="mt-1">{apiError}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <Field
                            label="Full Name"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            error={errors.fullName}
                            placeholder="e.g. Dr. Ahmed Khan"
                            maxLength={100}
                            autoComplete="name"
                        />

                        <Field
                            label="Mobile Number"
                            name="mobileNumber"
                            value={form.mobileNumber}
                            onChange={handleChange}
                            error={errors.mobileNumber}
                            placeholder="10-digit mobile number"
                            type="tel"
                            maxLength={10}
                            autoComplete="tel"
                        />

                        <Field
                            label="Email Address"
                            name="emailAddress"
                            value={form.emailAddress}
                            onChange={handleChange}
                            error={errors.emailAddress}
                            placeholder="doctor@example.com"
                            type="email"
                            maxLength={254}
                            autoComplete="email"
                        />

                        <div>
                            <label
                                htmlFor="doctor-qualificationId"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Qualification{' '}
                                <span className="text-red-500">*</span>
                            </label>

                            <select
                                id="doctor-qualificationId"
                                name="qualificationId"
                                value={form.qualificationId}
                                onChange={handleChange}
                                disabled={
                                    qualificationLoading ||
                                    qualifications.length === 0
                                }
                                aria-invalid={Boolean(errors.qualificationId)}
                                className={`w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 ${errors.qualificationId
                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                                    }`}
                            >
                                <option value="">
                                    {qualificationLoading
                                        ? 'Loading qualifications...'
                                        : 'Select qualification'}
                                </option>

                                {qualifications.map((qualification) => {
                                    const id =
                                        qualification.id ??
                                        qualification.qualificationId;

                                    const name =
                                        qualification.qualificationName ??
                                        qualification.name ??
                                        qualification.title ??
                                        qualification.degree ??
                                        (id != null
                                            ? `Qualification ${id}`
                                            : '');

                                    if (id == null) return null;

                                    return (
                                        <option key={id} value={id}>
                                            {name}
                                        </option>
                                    );
                                })}
                            </select>

                            {errors.qualificationId && (
                                <p className="mt-1.5 text-sm text-red-600">
                                    {errors.qualificationId}
                                </p>
                            )}

                            {qualificationError && (
                                <p
                                    role="alert"
                                    className="mt-1.5 text-sm text-amber-700"
                                >
                                    {qualificationError}
                                </p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label
                                htmlFor="doctor-address"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Address{' '}
                                <span className="text-red-500">*</span>
                            </label>

                            <textarea
                                id="doctor-address"
                                name="address"
                                rows={3}
                                value={form.address}
                                onChange={handleChange}
                                maxLength={250}
                                placeholder="Enter complete address"
                                aria-invalid={Boolean(errors.address)}
                                className={`w-full resize-y rounded-lg border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:ring-2 ${errors.address
                                    ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                                    : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                                    }`}
                            />

                            {errors.address && (
                                <p className="mt-1.5 text-sm text-red-600">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        <Field
                            label="City"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            error={errors.city}
                            placeholder="e.g. Hyderabad"
                            maxLength={100}
                            autoComplete="address-level2"
                        />

                        <Field
                            label="Country"
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            error={errors.country}
                            placeholder="e.g. India"
                            maxLength={100}
                            autoComplete="country-name"
                        />
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => {
                                setForm(initialForm);
                                setErrors({});
                                setSuccessMessage('');
                                setApiError('');
                            }}
                            disabled={submitting}
                            className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                        >
                            Clear Form
                        </button>

                        <button
                            type="submit"
                            disabled={submitting || qualificationLoading}
                            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting
                                ? 'Registering Doctor...'
                                : 'Register Doctor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
