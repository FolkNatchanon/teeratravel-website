// app/admin/page.tsx
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 mt-2">จัดการแพ็กเกจ/การจอง และสถานะต่าง ๆ ของระบบ</p>

            <div className="mt-6 flex flex-wrap gap-3">
                <Link
                    href="/admin/packages"
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 text-white px-5 py-2.5 text-sm font-semibold hover:bg-slate-800 transition"
                >
                    Manage Packages
                </Link>

                <Link
                    href="/admin/bookings"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
                >
                    Manage Booking
                </Link>
            </div>
        </div>
    );
}