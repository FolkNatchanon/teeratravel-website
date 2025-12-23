"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewBoatPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState<number>(10);
    const [isActive, setIsActive] = useState(true);

    const [error, setError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isSubmitting) return;

        setError("");
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/admin/boats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    name,
                    capacity,
                    is_active: isActive,
                }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setError(data?.message ?? "สร้างเรือไม่สำเร็จ");
                return;
            }

            // ✅ กลับไปหน้า list boats (คุณค่อยทำ page นี้ต่อได้)
            router.replace("/admin/boats");
            router.refresh();
        } catch (err) {
            setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="h-[calc(100vh-120px)] overflow-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">สร้างเรือใหม่</h1>
                <p className="text-slate-600 mt-1">
                    เพิ่มเรือเพื่อผูกกับแพ็กเกจ และใช้เป็นฐานกำหนดจำนวนคนสูงสุด
                </p>
            </div>

            <form
                onSubmit={onSubmit}
                className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            ชื่อเรือ
                        </label>
                        <input
                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="เช่น Boat A / เรือสปีดโบ๊ท 1"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            ความจุ (คน)
                        </label>
                        <input
                            type="number"
                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                            value={capacity}
                            onChange={(e) => setCapacity(Number(e.target.value))}
                            min={1}
                            disabled={isSubmitting}
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            ใช้กำหนด max คนของแพ็กเกจ (เมื่อ package ผูก boat)
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            id="is_active"
                            type="checkbox"
                            className="h-4 w-4"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            disabled={isSubmitting}
                        />
                        <label htmlFor="is_active" className="text-sm text-slate-700">
                            เปิดใช้งานเรือลำนี้ (is_active)
                        </label>
                    </div>

                    {error ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    ) : null}

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting || !name || capacity <= 0}
                            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "กำลังบันทึก..." : "สร้างเรือ"}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            ย้อนกลับ
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}