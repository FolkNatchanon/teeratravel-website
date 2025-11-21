// app/booking/BookingForm.tsx
"use client";

import { useState } from "react";

type Props = {
    packageId: number;
    packageName: string;
    basePrice: number;
};

export default function BookingForm({
    packageId,
    packageName,
    basePrice,
}: Props) {
    const [tripDate, setTripDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("เช้า");
    const [people, setPeople] = useState(2);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<null | { type: "success" | "error"; text: string }>(null);

    const totalPrice = basePrice * people;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    packageId,
                    tripDate,
                    timeSlot,
                    people,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.message ?? "จองไม่สำเร็จ");
            }

            setMessage({
                type: "success",
                text: "จองสำเร็จ! สามารถตรวจสอบได้ที่หน้า ประวัติการจอง",
            });
        } catch (err: any) {
            setMessage({
                type: "error",
                text: err.message ?? "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5 mt-4 text-sm md:text-base">
            {/* แสดงสรุปแพ็กเกจ */}
            <div className="rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3">
                <p className="font-semibold text-slate-800">{packageName}</p>
                <p className="text-slate-600 text-sm">
                    ราคาเริ่มต้น: {basePrice.toLocaleString()} บาท / ทริป
                </p>
            </div>

            {/* วันที่เดินทาง */}
            <div className="space-y-1">
                <label className="font-medium text-slate-800">วันที่เดินทาง</label>
                <input
                    type="date"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    value={tripDate}
                    onChange={(e) => setTripDate(e.target.value)}
                    required
                />
            </div>

            {/* ช่วงเวลา */}
            <div className="space-y-1">
                <label className="font-medium text-slate-800">ช่วงเวลา</label>
                <select
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                >
                    <option value="เช้า">เช้า (ประมาณ 09:00 - 12:00)</option>
                    <option value="บ่าย">บ่าย (ประมาณ 13:00 - 16:00)</option>
                    <option value="เต็มวัน">เต็มวัน</option>
                </select>
            </div>

            {/* จำนวนคน */}
            <div className="space-y-1">
                <label className="font-medium text-slate-800">จำนวนคน</label>
                <input
                    type="number"
                    min={1}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    value={people}
                    onChange={(e) => setPeople(Number(e.target.value) || 1)}
                    required
                />
            </div>

            {/* ราคารวมประมาณการ */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 flex items-center justify-between">
                <span className="text-slate-700 text-sm">ราคารวมโดยประมาณ</span>
                <span className="font-semibold text-emerald-700">
                    {totalPrice.toLocaleString()} บาท
                </span>
            </div>

            {/* แสดงข้อความผลลัพธ์ */}
            {message && (
                <div
                    className={`rounded-xl px-4 py-2 text-sm ${message.type === "success"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                >
                    {message.text}
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto inline-flex justify-center items-center px-6 py-2.5 rounded-full bg-sky-600 text-white font-medium text-sm md:text-base hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
                {isSubmitting ? "กำลังดำเนินการ..." : "ยืนยันการจอง"}
            </button>
        </form>
    );
}