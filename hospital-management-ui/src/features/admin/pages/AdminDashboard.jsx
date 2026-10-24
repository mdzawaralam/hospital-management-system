
import { useCallback, useEffect, useState } from 'react';
import api from '../../../services/api';

// Extract arrays from common API response structures.
function extractRows(responseData) {
    if (Array.isArray(responseData)) {
        return responseData;
    }

    const possibleArrays = [
        responseData?.data,
        responseData?.data?.data,
        responseData?.doctors,
        responseData?.patients,
        responseData?.results,
        responseData?.data?.patients,
        responseData?.data?.doctors,
        responseData?.data?.results,
    ];

    return possibleArrays.find(Array.isArray) ?? [];
}

// Format doctor specialties.
function getSpecialists(doctor) {
    const specialists = doctor?.specialists ?? [];

    if (!Array.isArray(specialists) || specialists.length === 0) {
        return '-';
    }

    return (
        specialists
            .map((specialist) =>
                typeof specialist === 'string'
                    ? specialist
                    : specialist?.specialistName ??
                    specialist?.name ??
                    ''
            )
            .filter(Boolean)
            .join(', ') || '-'
    );
}

// Handle Boolean or text status values.
function StatusBadge({ status }) {
    const isActive =
        status === true ||
        String(status).toLowerCase() === 'active' ||
        String(status).toLowerCase() === 'true';

    const label =
        typeof status === 'boolean'
            ? status
                ? 'Active'
                : 'Inactive'
            : status == null
                ? 'Unknown'
                : String(status);

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
                }`}
        >
            {label}
        </span>
    );
}

function EmptyRow({ colSpan, children }) {
    return (
        <tr>
            <td
                colSpan={colSpan}
                className="px-5 py-8 text-center text-sm text-slate-500"
            >
                {children}
            </td>
        </tr>
    );
}

function LoadingRow({ colSpan }) {
    return (
        <EmptyRow colSpan={colSpan}>
            Loading data...
        </EmptyRow>
    );
}

// Safely display an API error.
function getErrorMessage(error) {
    return (
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong while fetching data.'
    );
}

// Support common patient response field names.
function getPatientName(row) {
    return (
        row?.fullName ||
        row?.patientName ||
        row?.user?.fullName ||
        row?.patient?.fullName ||
        row?.patient?.user?.fullName ||
        [row?.firstName, row?.lastName].filter(Boolean).join(' ') ||
        [row?.user?.firstName, row?.user?.lastName]
            .filter(Boolean)
            .join(' ') ||
        '-'
    );
}

function getPatientDisease(row) {
    const diseases =
        row?.diseases ??
        row?.disease ??
        row?.patientDiseases ??
        row?.patient?.diseases ??
        row?.patient?.disease;

    if (Array.isArray(diseases)) {
        return (
            diseases
                .map((item) =>
                    typeof item === 'string'
                        ? item
                        : item?.diseaseName ?? item?.name ?? ''
                )
                .filter(Boolean)
                .join(', ') || '-'
        );
    }

    if (typeof diseases === 'string') {
        return diseases || '-';
    }

    return (
        diseases?.diseaseName ||
        diseases?.name ||
        row?.diseaseName ||
        '-'
    );
}

function getAssignedDoctor(row) {
    return (
        row?.assignedDoctor?.fullName ||
        row?.assignedDoctor?.user?.fullName ||
        row?.doctor?.fullName ||
        row?.doctor?.user?.fullName ||
        row?.patientAssignedDoctor?.doctor?.fullName ||
        row?.patientAssignedDoctor?.doctor?.user?.fullName ||
        row?.assignedDoctorName ||
        '-'
    );
}

function getAppointmentTime(row) {
    const value =
        row?.appointmentDateTime ||
        row?.appointmentTime ||
        row?.appointmentDate ||
        row?.scheduledAt ||
        row?.dateTime ||
        row?.createdAt;

    if (!value) {
        return '-';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString();
}

function SectionHeader({ title, description, onRefresh, refreshing }) {
    return (
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h2 className="text-lg font-semibold text-slate-900">
                    {title}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    {description}
                </p>
            </div>

            <button
                type="button"
                onClick={onRefresh}
                disabled={refreshing}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
        </div>
    );
}

export default function AdminDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

    const [doctorLoading, setDoctorLoading] = useState(true);
    const [patientLoading, setPatientLoading] = useState(true);

    const [doctorError, setDoctorError] = useState('');
    const [patientError, setPatientError] = useState('');

    const loadDoctorAvailability = useCallback(async () => {
        setDoctorLoading(true);
        setDoctorError('');

        try {
            const response = await api.get('/api/doctor/availability');
            const rows = extractRows(response.data);

            setDoctors(rows);
        } catch (error) {
            setDoctorError(getErrorMessage(error));
            setDoctors([]);
        } finally {
            setDoctorLoading(false);
        }
    }, []);

    const loadPatients = useCallback(async () => {
        setPatientLoading(true);
        setPatientError('');

        try {
            const response = await api.get('/api/receptionist/patients');
            const rows = extractRows(response.data);

            setPatients(rows);
        } catch (error) {
            setPatientError(getErrorMessage(error));
            setPatients([]);
        } finally {
            setPatientLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDoctorAvailability();
        loadPatients();
    }, [loadDoctorAvailability, loadPatients]);

    const refreshAll = () => {
        loadDoctorAvailability();
        loadPatients();
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-8">
                {/* Dashboard heading */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Admin Dashboard
                        </h1>

                        <p className="mt-2 text-sm text-slate-600">
                            Monitor doctor availability and patient records.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={refreshAll}
                        disabled={doctorLoading || patientLoading}
                        className="self-start rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
                    >
                        Refresh Dashboard
                    </button>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Doctor Availability Records
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {doctorLoading ? '—' : doctors.length}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-medium text-slate-500">
                            Patient Records
                        </p>

                        <p className="mt-2 text-3xl font-bold text-slate-900">
                            {patientLoading ? '—' : patients.length}
                        </p>
                    </div>
                </div>

                {/* Doctor availability table */}
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <SectionHeader
                        title="Doctor Availability"
                        description="Doctors, specialties, working days, and available time slots."
                        onRefresh={loadDoctorAvailability}
                        refreshing={doctorLoading}
                    />

                    {doctorError && (
                        <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            <p className="font-semibold">
                                Unable to load doctor availability.
                            </p>
                            <p className="mt-1">{doctorError}</p>

                            <button
                                type="button"
                                onClick={loadDoctorAvailability}
                                className="mt-3 font-semibold underline"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-[750px] w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-5 py-4 font-semibold">
                                        Doctor
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Specialty
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Day
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Available Time
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {doctorLoading ? (
                                    <LoadingRow colSpan={5} />
                                ) : doctorError ? (
                                    <EmptyRow colSpan={5}>
                                        Doctor availability could not be loaded.
                                    </EmptyRow>
                                ) : doctors.length === 0 ? (
                                    <EmptyRow colSpan={5}>
                                        No doctor availability records found.
                                    </EmptyRow>
                                ) : (
                                    doctors.map((row, index) => (
                                        <tr
                                            key={
                                                row.id ??
                                                row.doctorId ??
                                                `doctor-availability-${index}`
                                            }
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="px-5 py-4 font-medium text-slate-800">
                                                {row.doctor?.fullName ??
                                                    row.doctor?.user?.fullName ??
                                                    '-'}
                                            </td>

                                            <td className="px-5 py-4 text-slate-600">
                                                {getSpecialists(row.doctor)}
                                            </td>

                                            <td className="px-5 py-4 text-slate-600">
                                                {row.weekSlot?.weekName ?? '-'}
                                            </td>

                                            <td className="px-5 py-4 text-slate-600">
                                                {row.weekSlot?.slot?.slotTime ??
                                                    '-'}
                                            </td>

                                            <td className="px-5 py-4">
                                                <StatusBadge
                                                    status={row.status}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-slate-200 px-5 py-3 text-xs text-slate-500">
                        {doctorLoading
                            ? 'Loading records...'
                            : `${doctors.length} availability record(s)`}
                    </div>
                </section>

                {/* Patient list table */}
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <SectionHeader
                        title="Patient List"
                        description="Registered patients and their available assignment details."
                        onRefresh={loadPatients}
                        refreshing={patientLoading}
                    />

                    {patientError && (
                        <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            <p className="font-semibold">
                                Unable to load patients.
                            </p>
                            <p className="mt-1">{patientError}</p>

                            <button
                                type="button"
                                onClick={loadPatients}
                                className="mt-3 font-semibold underline"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-[800px] w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-5 py-4 font-semibold">
                                        Patient
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Disease
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Assigned Doctor
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Date / Time
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {patientLoading ? (
                                    <LoadingRow colSpan={5} />
                                ) : patientError ? (
                                    <EmptyRow colSpan={5}>
                                        Patient records could not be loaded.
                                    </EmptyRow>
                                ) : patients.length === 0 ? (
                                    <EmptyRow colSpan={5}>
                                        No patient records found.
                                    </EmptyRow>
                                ) : (
                                    patients.map((row, index) => (
                                        <tr
                                            key={
                                                row.id ??
                                                row.patientId ??
                                                `patient-${index}`
                                            }
                                            className="transition hover:bg-slate-50"
                                        >
                                            <td className="px-5 py-4 font-medium text-slate-800">
                                                {getPatientName(row)}
                                            </td>

                                            <td className="px-5 py-4 text-slate-600">
                                                {getPatientDisease(row)}
                                            </td>

                                            <td className="px-5 py-4 text-slate-600">
                                                {getAssignedDoctor(row)}
                                            </td>

                                            <td className="px-5 py-4 text-slate-600">
                                                {getAppointmentTime(row)}
                                            </td>

                                            <td className="px-5 py-4">
                                                <StatusBadge
                                                    status={row.status}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-slate-200 px-5 py-3 text-xs text-slate-500">
                        {patientLoading
                            ? 'Loading records...'
                            : `${patients.length} patient record(s)`}
                    </div>
                </section>
            </div>
        </div>
    );
}
