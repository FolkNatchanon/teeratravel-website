import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl px-6 pt-24 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
                    <aside className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-fit">
                        <div className="mb-5">
                            <p className="text-xs text-slate-500">Admin Panel</p>
                            <h2 className="text-lg font-semibold text-slate-900">TeeraTravel</h2>
                        </div>

                        <nav className="space-y-2">
                            <Link
                                href="/admin"
                                className="block px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/admin/bookings"
                                className="block px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700"
                            >
                                Bookings
                            </Link>
                            <Link
                                href="/admin/packages"
                                className="block px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700"
                            >
                                Packages
                            </Link>
                            <Link
                                href="/admin/boats"
                                className="block px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700"
                            >
                                Boats
                            </Link>
                            <Link
                                href="/admin/join-trips"
                                className="block px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700"
                            >
                                Join Trips
                            </Link>
                        </nav>

                        <div className="mt-6 pt-5 border-t border-slate-200">
                            <p className="text-xs text-slate-500">
                                *สิทธิ์เข้าถึง: role = <span className="font-semibold">A</span>
                            </p>
                        </div>
                    </aside>

                    <section>{children}</section>
                </div>
            </div>
        </div>
    );
}