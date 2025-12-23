// components/nav/UserNavbar.tsx
import Link from "next/link";
import { getCurrentUser } from "@/app/lib/auth/currentUser";
import UserNavActions from "./UserNavActions.client";

export default async function UserNavbar() {
    const user = await getCurrentUser();

    return (
        <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-sky-600 flex items-center gap-1">
                    Teera<span className="text-yellow-500">Travel</span>
                </Link>

                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-6 text-slate-700">
                        <Link href="/" className="hover:text-sky-600 transition">หน้าแรก</Link>
                        <Link href="/package" className="hover:text-sky-600 transition">แพ็กเกจ</Link>
                        {user && <Link href="/history" className="hover:text-sky-600 transition">ประวัติการจอง</Link>}
                        <Link href="/contact" className="hover:text-sky-600 transition">ติดต่อ</Link>
                        {user?.role === "A" && <Link href="/admin" className="hover:text-sky-600 transition">Admin</Link>}
                    </div>

                    <div className="w-px h-6 bg-slate-300"></div>

                    <UserNavActions user={user} />
                </div>
            </div>
        </nav>
    );
}