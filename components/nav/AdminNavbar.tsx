// components/nav/AdminNavbar.tsx
import Link from "next/link";
import { getCurrentUser } from "@/app/lib/auth/currentUser";
import AdminNavActions from "./AdminNavActions.client";

export const dynamic = "force-dynamic";

export default async function AdminNavbar() {
    const user = await getCurrentUser();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-6 py-4">
                <div className="flex items-center justify-between gap-6">
                    {/* Left: Logo */}
                    <Link href="/admin" className="text-2xl font-bold text-sky-600 flex items-center gap-1">
                        Teera<span className="text-yellow-500">Travel</span>
                    </Link>

                    {/* Center: ตรวจหน้าเว็บ */}
                    <div className="hidden sm:flex items-center gap-5 text-slate-700">
                        <Link href="/" className="hover:text-sky-600 transition">
                            ดูหน้าเว็บ (Home)
                        </Link>
                        <Link href="/package" className="hover:text-sky-600 transition">
                            ดูหน้าเว็บ (Packages)
                        </Link>
                    </div>

                    {/* Right: Logout */}
                    <AdminNavActions user={user} />
                </div>

                {/* Mobile */}
                <div className="mt-3 flex sm:hidden gap-4 text-sm text-slate-700">
                    <Link href="/" className="hover:text-sky-600 transition">
                        Home
                    </Link>
                    <Link href="/package" className="hover:text-sky-600 transition">
                        Packages
                    </Link>
                </div>
            </div>
        </nav>
    );
}