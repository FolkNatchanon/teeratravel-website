"use client";

import { useRouter } from "next/navigation";
import type { TeeraUserCookie } from "@/app/lib/auth/types";
import Link from "next/link";
import { useTransition } from "react";

export default function UserMenuClient({ user }: { user: TeeraUserCookie | null }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function logout() {
        startTransition(async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            router.refresh();        // ✅ ให้ server components (Navbar) อ่าน cookie ใหม่
            router.push("/");        // (เลือกได้) พากลับหน้าแรก
        });
    }

    if (!user) {
        return (
            <Link
                href="/login"
                className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
            >
                Login
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-3">
            {user.role === "A" ? (
                <Link className="text-slate-700 hover:text-slate-900 font-semibold" href="/admin">
                    Admin
                </Link>
            ) : null}

            <span className="text-slate-700 font-semibold">{user.username}</span>

            <button
                disabled={isPending}
                onClick={logout}
                className="px-4 py-2 rounded-full bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 disabled:opacity-60"
            >
                {isPending ? "..." : "Logout"}
            </button>
        </div>
    );
}