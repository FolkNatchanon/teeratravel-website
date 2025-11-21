"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                email,
                user_fname: fname,
                user_lname: lname,
                password,
                phone_number: phone,
            }),
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
                    สมัครสมาชิก
                </h1>

                <form onSubmit={handleRegister} className="space-y-5">

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            ชื่อผู้ใช้
                        </label>
                        <input
                            type="text"
                            className="w-full border border-slate-300 px-3 py-2 rounded-lg 
                         text-slate-800
                         focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    {/* First Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            ชื่อจริง
                        </label>
                        <input
                            type="text"
                            className="w-full border border-slate-300 px-3 py-2 rounded-lg
                         text-slate-800
                         focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                            value={fname}
                            onChange={(e) => setFname(e.target.value)}
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            นามสกุล
                        </label>
                        <input
                            type="text"
                            className="w-full border border-slate-300 px-3 py-2 rounded-lg
                         text-slate-800
                         focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                            value={lname}
                            onChange={(e) => setLname(e.target.value)}
                        />
                    </div>

                    {/* Phone number */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            เบอร์โทรศัพท์
                        </label>
                        <input
                            type="tel"
                            className="w-full border border-slate-300 px-3 py-2 rounded-lg
                         text-slate-800
                         focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            อีเมล
                        </label>
                        <input
                            type="email"
                            className="w-full border border-slate-300 px-3 py-2 rounded-lg
                         text-slate-800
                         focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                         text-slate-800
                         focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-sky-600 text-white py-2.5 rounded-lg font-medium hover:bg-sky-700 transition"
                    >
                        สมัครสมาชิก
                    </button>
                </form>

                <p className="text-center text-sm text-slate-600 mt-4">
                    มีบัญชีอยู่แล้ว?{" "}
                    <Link href="/login" className="text-sky-600 font-medium hover:underline">
                        เข้าสู่ระบบ
                    </Link>
                </p>
            </div>
        </main>
    );
}