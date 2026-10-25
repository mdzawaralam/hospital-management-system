
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function DoctorList() {
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDoctors = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const response = await api.get('/api/admin/doctor/');

            if (response.data?.success) {
                setDoctors(response.data.data ?? []);
            } else {
                setDoctors([]);
                setError(response.data?.message || 'Unable to fetch doctors.');
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to load doctors. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    const filteredDoctors = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return doctors;

        return doctors.filter((doctor) => {
            const searchableText = [
                doctor.id,
                doctor.fullName,
                doctor.user?.emailAddress,
                doctor.mobileNumber,
                doctor.qualification?.name,
                ...(doctor.specialists ?? []).map(
                    (specialist) => specialist.specialistName
                ),
                doctor.city,
                doctor.country,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return searchableText.includes(term);
        });
    }, [doctors, search]);

    const exportRows = useCallback(() => {
        return filteredDoctors.map((doctor) => ({
            'Doctor ID': doctor.id,
            'Full Name': doctor.fullName || '',
            'Email': doctor.user?.emailAddress || '',
            'Mobile Number': doctor.mobileNumber || '',
            'Qualification': doctor.qualification?.name || '',
            'Specialists': (doctor.specialists ?? [])
                .map((item) => item.specialistName)
                .join(', ') || 'Not assigned',
            'Address': doctor.address || '',
            'City': doctor.city || '',
            'Country': doctor.country || '',
            'Status': doctor.status ? 'Active' : 'Inactive',
        }));
    }, [filteredDoctors]);

    const exportExcel = () => {
        if (!filteredDoctors.length) {
            toast.info('No doctors available to export.');
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(exportRows());
        worksheet['!cols'] = [
            { wch: 12 }, { wch: 25 }, { wch: 32 },
            { wch: 18 }, { wch: 20 }, { wch: 28 },
            { wch: 40 }, { wch: 18 }, { wch: 18 }, { wch: 12 },
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Doctors');
        XLSX.writeFile(workbook, 'Doctor_List.xlsx');
    };

    const exportPDF = () => {
        if (!filteredDoctors.length) {
            toast.info('No doctors available to export.');
            return;
        }

        const doc = new jsPDF({ orientation: 'landscape' });

        doc.setFontSize(16);
        doc.text('Hospital Management System - Doctor List', 14, 15);

        doc.setFontSize(9);
        doc.text(`Total doctors: ${filteredDoctors.length}`, 14, 22);

        autoTable(doc, {
            startY: 28,
            head: [[
                'ID', 'Doctor Name', 'Email', 'Mobile',
                'Qualification', 'Specialist', 'City',
                'Country', 'Status',
            ]],
            body: filteredDoctors.map((doctor) => [
                doctor.id,
                doctor.fullName || '-',
                doctor.user?.emailAddress || '-',
                doctor.mobileNumber || '-',
                doctor.qualification?.name || '-',
                (doctor.specialists ?? [])
                    .map((item) => item.specialistName)
                    .join(', ') || 'Not assigned',
                doctor.city || '-',
                doctor.country || '-',
                doctor.status ? 'Active' : 'Inactive',
            ]),
            styles: { fontSize: 7, cellPadding: 2 },
            headStyles: { fillColor: [31, 78, 121] },
            theme: 'grid',
        });

        doc.save('Doctor_List.pdf');
    };

    const handleDelete = async (doctor) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${doctor.fullName}?`
        );

        if (!confirmed) return;

        try {
            // Assumes the backend supports DELETE /api/admin/doctor/:id.
            await api.delete(`/api/admin/doctor/${doctor.id}`);

            toast.success('Doctor deleted successfully.');
            await fetchDoctors();
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                'Unable to delete doctor. Please check the API endpoint.'
            );
        }
    };

    const handleEdit = (doctor) => {
        navigate(`/admin/doctors/${doctor.id}/edit`);
    };

    const handleAvailability = (doctor) => {
        navigate(`/admin/doctors/${doctor.id}/availability`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <ToastContainer position="top-right" />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Doctor List
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage registered doctors and their availability.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate('/admin/doctors/register')}
                    className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
                >
                    + Register Doctor
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-gray-200 p-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="font-semibold text-gray-800">
                            Registered Doctors
                        </h2>
                        <p className="text-sm text-gray-500">
                            {filteredDoctors.length} doctor(s) shown
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search name, email, mobile..."
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
                            aria-label="Search doctors"
                        />

                        <button
                            type="button"
                            onClick={exportPDF}
                            disabled={!filteredDoctors.length}
                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Export PDF
                        </button>

                        <button
                            type="button"
                            onClick={exportExcel}
                            disabled={!filteredDoctors.length}
                            className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Export Excel
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="m-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <p>{error}</p>
                        <button
                            type="button"
                            onClick={fetchDoctors}
                            className="mt-2 font-semibold underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        Loading doctors...
                    </div>
                ) : !error && filteredDoctors.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        {search
                            ? 'No doctors match your search.'
                            : 'No doctors found.'}
                    </div>
                ) : !error ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-[1200px] w-full text-left text-sm">
                            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                                <tr>
                                    {[
                                        'ID',
                                        'Doctor',
                                        'Email',
                                        'Mobile',
                                        'Qualification',
                                        'Specialist',
                                        'Location',
                                        'Status',
                                        'Action',
                                    ].map((heading) => (
                                        <th key={heading} className="px-4 py-3 font-semibold">
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {filteredDoctors.map((doctor) => (
                                    <tr
                                        key={doctor.id}
                                        className="align-top hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-4">{doctor.id}</td>

                                        <td className="px-4 py-4">
                                            <p className="font-semibold text-gray-800">
                                                {doctor.fullName || '-'}
                                            </p>
                                            <p className="mt-1 max-w-56 text-xs text-gray-500">
                                                {doctor.address || '-'}
                                            </p>
                                        </td>

                                        <td className="px-4 py-4 text-gray-600">
                                            {doctor.user?.emailAddress || '-'}
                                        </td>

                                        <td className="px-4 py-4">
                                            {doctor.mobileNumber || '-'}
                                        </td>

                                        <td className="px-4 py-4">
                                            {doctor.qualification?.name || '-'}
                                        </td>

                                        <td className="px-4 py-4">
                                            {(doctor.specialists ?? []).length
                                                ? doctor.specialists
                                                    .map((item) => item.specialistName)
                                                    .join(', ')
                                                : 'Not assigned'}
                                        </td>

                                        <td className="px-4 py-4">
                                            {[doctor.city, doctor.country]
                                                .filter(Boolean)
                                                .join(', ') || '-'}
                                        </td>

                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${doctor.status
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                    }`}
                                            >
                                                {doctor.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(doctor)}
                                                    className="rounded-md bg-blue-50 px-3 py-1.5 font-medium text-blue-700 hover:bg-blue-100"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(doctor)}
                                                    className="rounded-md bg-red-50 px-3 py-1.5 font-medium text-red-700 hover:bg-red-100"
                                                >
                                                    Delete
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleAvailability(doctor)}
                                                    className="rounded-md bg-purple-50 px-3 py-1.5 font-medium text-purple-700 hover:bg-purple-100"
                                                >
                                                    Availability
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
