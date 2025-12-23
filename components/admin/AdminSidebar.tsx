// components/admin/AdminSidebar.tsx
import Link from "next/link";

const itemBase =
    "block rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition";

export default function AdminSidebar() {
    return (
        <aside className="border border-slate-200 bg-white p-5 shadow-sm">
            {/* Header */}
            <div className="mb-4">
                <p className="text-xs text-slate-500">Admin Panel</p>
                <h2 className="text-lg font-bold text-slate-900">TeeraTravel</h2>
            </div>

            {/* Menu */}
            <nav className="space-y-1">
                <Link className={itemBase} href="/admin">
                    Dashboard
                </Link>
                <Link className={itemBase} href="/admin/packages">
                    Packages
                </Link>
                <Link className={itemBase} href="/admin/bookings">
                    Bookings
                </Link>
                <Link className={itemBase} href="/admin/boats">
                    Boats
                </Link>
            </nav>
        </aside>
    );
}