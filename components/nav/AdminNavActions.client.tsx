// components/nav/AdminNavActions.client.tsx
"use client";

import { useRouter } from "next/navigation";
import type { TeeraUserCookie } from "@/app/lib/auth/types";
import Link from "next/link";

export default function AdminNavActions({ user }: { user: TeeraUserCookie | null }) {
    const router = useRouter();

    const logout = async () => {
        const ok = window.confirm("ยืนยันออกจากระบบใช่ไหม?");
        if (!ok) return;

        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        // ✅ ให้ navbar เปลี่ยนทันที (server component อ่าน cookie ใหม่)
        router.replace("/login?next=/admin");
        setTimeout(() => router.refresh(), 0);
    };

    // ถ้า cookie หาย (ยังไม่ login) ให้มีปุ่มกลับไป login
    if (!user) {
        return (
            <Link
                href="/login?next=/admin"
                className="rounded-xl bg-sky-600 text-white px-4 py-2 text-sm font-semibold hover:bg-sky-700 transition"
            >
                Login
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm font-semibold text-slate-700">
                {user.username}
            </span>

            <button
                onClick={logout}
                className="rounded-xl bg-rose-500 text-white px-4 py-2 text-sm font-semibold hover:bg-rose-600 transition"
            >
                Logout
            </button>
        </div>
    );
}