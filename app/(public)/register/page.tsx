"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

export default function RegisterPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [user_fname, setUserFname] = useState("");
    const [user_lname, setUserLname] = useState("");
    const [email, setEmail] = useState("");
    const [phone_number, setPhoneNumber] = useState("");
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
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                signal: abortRef.current.signal,
                body: JSON.stringify({
                    username,
                    user_fname,
                    user_lname,
                    email,
                    phone_number,
                    password,
                }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setError(data?.message ?? "สมัครสมาชิกไม่สำเร็จ");
                return;
            }

            // ✅ register แล้ว login ให้ทันที (เพราะ API set cookie)
            router.replace("/");
            router.refresh();
        } catch (err: any) {
            if (err?.name !== "AbortError") setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
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
                        <h1 className="text-2xl font-bold text-slate-800">สมัครสมาชิก</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className={labelBase}>Username</label>
                            <input
                                className={inputBase}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div>
                            <label className={labelBase}>ชื่อ</label>
                            <input
                                className={inputBase}
                                value={user_fname}
                                onChange={(e) => setUserFname(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label className={labelBase}>นามสกุล</label>
                            <input
                                className={inputBase}
                                value={user_lname}
                                onChange={(e) => setUserLname(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div>
                            <label className={labelBase}>Email</label>
                            <input
                                type="email"
                                className={inputBase}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div>
                            <label className={labelBase}>เบอร์โทร</label>
                            <input
                                className={inputBase}
                                value={phone_number}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div>
                            <label className={labelBase}>Password</label>
                            <input
                                type="password"
                                className={inputBase}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>

                        {error ? (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        ) : null}

                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                !username ||
                                !user_fname ||
                                !user_lname ||
                                !email ||
                                !phone_number ||
                                !password
                            }
                            className="w-full rounded-lg bg-sky-600 text-white py-2.5 font-semibold hover:bg-sky-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Creating..." : "Register"}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center justify-center text-sm">
                        <Link href="/login" className="text-sky-600 font-medium hover:underline">
                            มีบัญชีแล้ว? Login
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