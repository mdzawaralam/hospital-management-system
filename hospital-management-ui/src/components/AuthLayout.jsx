
export default function AuthLayout({ title, subtitle, children }) {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-7">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white shadow-lg">
                        +
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Hospital Management
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Healthcare management made simple
                    </p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">
                    <h2 className="text-2xl font-semibold text-slate-900">
                        {title}
                    </h2>

                    <p className="mt-2 mb-6 text-sm text-slate-500">
                        {subtitle}
                    </p>

                    {children}
                </div>

                <p className="mt-6 text-center text-xs text-slate-500">
                    Hospital Management System
                </p>
            </div>
        </div>
    );
}
