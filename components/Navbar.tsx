import Link from "next/link";
import { getCurrentUser } from "@/app/lib/getCurrentUser";

export default async function Navbar() {
    const user = await getCurrentUser();

    return (
        <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                {/* Logo */}
                <Link
                    href="/"
                    className="text-2xl font-bold text-sky-600 flex items-center gap-1"
                >
                    Teera<span className="text-yellow-500">Travel</span>
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-10">

                    {/* เมนูหลัก */}
                    <div className="flex items-center gap-6 text-slate-700">
                        <Link href="/" className="hover:text-sky-600 transition">หน้าแรก</Link>
                        <Link href="/package" className="hover:text-sky-600 transition">แพ็กเกจ</Link>
                        {user && (
                            <Link href="/history" className="hover:text-sky-600 transition">
                                ประวัติการจอง
                            </Link>
                        )}
                        <Link href="/contact" className="hover:text-sky-600 transition">ติดต่อ</Link>
                    </div>

                    {/* เส้นคั่น */}
                    <div className="w-px h-6 bg-slate-300"></div>

                    {/* Login / Register */}
                    {!user && (
                        <div className="flex items-center gap-4">

                            <Link href="/login" className="text-slate-700 hover:text-sky-600 transition">
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="bg-sky-600 text-white px-4 py-2 rounded-full text-sm hover:bg-sky-700 transition"
                            >
                                Register
                            </Link>

                        </div>
                    )}

                    {/* User logged in */}
                    {user && (
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-slate-700 "> {user.username}</span>

                            <form action="/api/auth/logout" method="POST">
                                <button
                                    type="submit"
                                    className="bg-rose-500 text-white px-4 py-2 rounded-full text-sm hover:bg-rose-600 transition"
                                >
                                    Logout
                                </button>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </nav>
    );
}