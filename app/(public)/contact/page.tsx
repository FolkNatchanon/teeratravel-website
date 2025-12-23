"use client";

import { Mail, Phone, MapPin, Facebook } from "lucide-react";
import { FormEvent, useState } from "react";

export default function ContactPage() {
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSending(true);
        setStatus("idle");
        setMessage("");

        const formData = new FormData(e.currentTarget);
        const payload = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            subject: formData.get("subject"),
            content: formData.get("content"),
        };

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("request failed");

            setStatus("success");
            setMessage(
                "ส่งข้อความเรียบร้อยแล้ว! ทีมงานจะติดต่อกลับโดยเร็วที่สุด 😊"
            );
            e.currentTarget.reset();
        } catch (err) {
            setStatus("error");
            setMessage("เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง");
        } finally {
            setIsSending(false);
        }
    }

    return (
        <main className="min-h-screen pt-32 pb-24 bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-6xl mx-auto px-6">

                {/* HEADER */}
                <div className="text-center mb-14">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                        ติดต่อ <span className="text-sky-600">TeeraTravel</span>
                    </h1>
                    <p className="mt-5 text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        ต้องการสอบถามแพ็กเกจดำน้ำ เรือเหมาลำ ปรึกษาออกแบบทริป หรือแจ้งปัญหา
                        ทีมงานของเราพร้อมให้บริการเต็มที่ ❤️
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* CONTACT INFO */}
                    <div className="space-y-6 md:col-span-1">

                        {/* Card 1 */}
                        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 p-7">
                            <h2 className="text-lg font-semibold text-slate-900 mb-5">
                                ช่องทางติดต่อหลัก
                            </h2>

                            <div className="space-y-5 text-slate-700 text-sm">

                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-sky-100 text-sky-600 rounded-xl">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">โทรศัพท์</p>
                                        <p className="mt-0.5">08x-xxx-xxxx</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">อีเมล</p>
                                        <p className="mt-0.5">contact@teeratravel.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">ที่ตั้ง</p>
                                        <p className="mt-0.5 leading-snug">
                                            อ.บางสะพาน จ.ประจวบคีรีขันธ์ <br /> (ท่าเรือไปเกาะทะลุ)
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 p-7">
                            <h2 className="text-lg font-semibold text-slate-900 mb-5">
                                Social & แชทด่วน
                            </h2>

                            <div className="space-y-3 text-sm text-slate-700">

                                <a
                                    href="#"
                                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 hover:bg-sky-50 hover:border-sky-400 transition shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <Facebook className="w-5 h-5" />
                                        <span>Facebook Page</span>
                                    </div>
                                    <span className="text-xs text-slate-500">ทักแชท</span>
                                </a>

                                <a
                                    href="#"
                                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 hover:bg-emerald-50 hover:border-emerald-400 transition shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-xs font-bold text-emerald-600">
                                            L
                                        </div>
                                        <span>LINE Official</span>
                                    </div>
                                    <span className="text-xs text-slate-500">@teeratravel</span>
                                </a>

                            </div>
                        </div>
                    </div>

                    {/* FORM */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 p-8">
                            <h2 className="text-xl font-semibold text-slate-900 mb-6">
                                ส่งข้อความถึงเรา
                            </h2>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            ชื่อ–นามสกุล
                                        </label>
                                        <input
                                            name="name"
                                            required
                                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm bg-slate-50 hover:bg-white focus:bg-white transition focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none"
                                            placeholder="ชื่อที่ให้เราติดต่อกลับ"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            เบอร์โทร
                                        </label>
                                        <input
                                            name="phone"
                                            required
                                            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm bg-slate-50 hover:bg-white focus:bg-white transition focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none"
                                            placeholder="08x-xxx-xxxx"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        อีเมล
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 hover:bg-white transition px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none"
                                        placeholder="ถ้าไม่มีสามารถเว้นว่างได้"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        หัวข้อ
                                    </label>
                                    <input
                                        name="subject"
                                        required
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 hover:bg-white transition px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none"
                                        placeholder="เช่น สอบถามแพ็กเกจ snorkel สำหรับ 6 คน"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        รายละเอียดเพิ่มเติม
                                    </label>
                                    <textarea
                                        name="content"
                                        required
                                        rows={4}
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 hover:bg-white transition px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none resize-none"
                                        placeholder="ระบุวันที่ประมาณการ จำนวนคน และสิ่งที่อยากให้ช่วยแนะนำ"
                                    />
                                </div>

                                {status === "success" && (
                                    <p className="text-sm text-emerald-600">{message}</p>
                                )}
                                {status === "error" && (
                                    <p className="text-sm text-red-500">{message}</p>
                                )}

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSending}
                                        className="inline-flex items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white px-6 py-2.5 text-sm font-medium shadow-md transition"
                                    >
                                        {isSending ? "กำลังส่ง..." : "ส่งข้อความ"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}