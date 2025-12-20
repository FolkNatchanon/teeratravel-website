"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

export default function LoginPage() {
    const router = useRouter();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const abortRef = useRef<AbortController | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (isSubmitting) return;

        setError("");
        setIsSubmitting(true);

        abortRef.current?.abort();
        abortRef.current = new AbortController();

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                signal: abortRef.current.signal,
                body: JSON.stringify({ identifier, password }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setError(data?.message ?? "เข้าสู่ระบบไม่สำเร็จ");
                return;
            }

            // สำคัญ: API set httpOnly cookie แล้ว
            // เราแค่พาไปหน้าที่ถูก และ refresh ให้ server components อ่าน cookie ใหม่
            if (data?.role === "A") {
                router.replace("/admin");
                router.refresh();
            } else {
                router.replace("/");
                router.refresh();
            }
        } catch (err: any) {
            if (err?.name !== "AbortError") {
                setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    const inputBase =
        "w-full border border-slate-300 px-3 py-2.5 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition disabled:opacity-60 disabled:cursor-not-allowed";
    const labelBase = "block text-sm font-medium text-slate-700 mb-1";

    return (
        <main className="min-h-[calc(100vh-0px)] flex items-center justify-center bg-slate-50 px-4 py-16">
            <div className="w-full max-w-md">
                <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-8">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-bold text-slate-800">เข้าสู่ระบบ</h1>
                        <p className="text-sm text-slate-500 mt-1">TeeraTravel Admin/User</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className={labelBase}>อีเมลหรือชื่อผู้ใช้</label>
                            <input
                                type="text"
                                className={inputBase}
                                placeholder="example@gmail.com หรือ yourusername"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                disabled={isSubmitting}
                                autoComplete="username"
                            />
                        </div>

                        <div>
                            <label className={labelBase}>รหัสผ่าน</label>
                            <input
                                type="password"
                                className={inputBase}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isSubmitting}
                                autoComplete="current-password"
                            />
                        </div>

                        {error ? (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        ) : null}

                        <button
                            type="submit"
                            disabled={isSubmitting || !identifier || !password}
                            className="w-full rounded-lg bg-sky-600 text-white py-2.5 font-semibold hover:bg-sky-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center justify-between text-sm">
                        <Link href="/register" className="text-sky-600 font-medium hover:underline">
                            สมัครสมาชิก
                        </Link>

                        <Link href="/" className="text-slate-600 hover:underline">
                            กลับหน้าแรก
                        </Link>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-500 mt-4">
                    By continuing, you agree to TeeraTravel policies.
                </p>
            </div>
        </main>
    );
}