// components/nav/UserNavActions.client.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { TeeraUserCookie } from "@/app/lib/auth/types";

export default function UserNavActions({ user }: { user: TeeraUserCookie | null }) {
    const router = useRouter();

    const logout = async () => {
        const ok = window.confirm("ยืนยันออกจากระบบใช่ไหม?");
        if (!ok) return;

        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        // ✅ ไปหน้าแรกก่อน
        router.replace("/");

        // ✅ แล้วค่อย refresh เพื่อให้ Server Components (Navbar) อ่าน cookie ใหม่
        setTimeout(() => {
            router.refresh();
        }, 0);
    };

    if (!user) {
        return (
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
        );
    }

    return (
        <div className="flex items-center gap-4">
            <span className="font-bold text-slate-700">{user.username}</span>

            <button
                onClick={logout}
                className="bg-rose-500 text-white px-4 py-2 rounded-full text-sm hover:bg-rose-600 transition"
            >
                Logout
            </button>
        </div>
    );
}