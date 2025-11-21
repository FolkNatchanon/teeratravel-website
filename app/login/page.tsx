"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier, password }),
        });

        if (res.redirected) {
            window.location.href = res.url;
            return;
        }

        if (!res.ok) {
            const data = await res.json();
            setError(data.message);
        }
    }

    return (
        <main className="pt-32 pb-20 flex justify-center">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-slate-200">

                <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">
                    เข้าสู่ระบบ
                </h1>

                <form onSubmit={handleLogin} className="space-y-5">

                    {/* Identifier */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            อีเมลหรือชื่อผู้ใช้
                        </label>
                        <input
                            type="text"
                            className="w-full border border-slate-300 px-3 py-2 rounded-lg
                         text-slate-800 placeholder-slate-400
                         focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                            placeholder="example@gmail.com หรือ yourusername"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            รหัสผ่าน
                        </label>
                        <input
                            type="password"
                            className="w-full border border-slate-300 px-3 py-2 rounded-lg
                         text-slate-800 placeholder-slate-400
                         focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-sky-600 text-white py-2.5 rounded-lg font-medium hover:bg-sky-700 transition"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-sm text-slate-600 mt-4">
                    ยังไม่มีบัญชี?{" "}
                    <Link href="/register" className="text-sky-600 font-medium hover:underline">
                        สมัครสมาชิก
                    </Link>
                </p>
            </div>
        </main>
    );
}