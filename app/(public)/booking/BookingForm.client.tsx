// app/(public)/booking/BookingForm.client.tsx
"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function BookingForm({ packageData }: { packageData: any }) {
    const router = useRouter();

    const packageId = packageData?.package_id ?? packageData?.id;
    const max = packageData?.max_participants ?? 50;

    const [tripDate, setTripDate] = useState<string>("");
    const [passengerCount, setPassengerCount] = useState<number>(1);

    const [contactName, setContactName] = useState<string>("");
    const [contactPhone, setContactPhone] = useState<string>("");
    const [note, setNote] = useState<string>("");

    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const inputBase =
        "w-full border border-slate-300 px-3 py-2.5 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition disabled:opacity-60 disabled:cursor-not-allowed";

    const canSubmit = useMemo(() => {
        return (
            !!packageId &&
            !!tripDate &&
            passengerCount >= 1 &&
            passengerCount <= max &&
            !!contactName.trim() &&
            !!contactPhone.trim()
        );
    }, [packageId, tripDate, passengerCount, max, contactName, contactPhone]);

    async function submit() {
        setError("");
        setSuccess("");

        if (!canSubmit) {
            setError("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    package_id: Number(packageId),
                    trip_date: tripDate,
                    passenger_count: passengerCount,
                    contact_name: contactName,
                    contact_phone: contactPhone,
                    note: note || null,
                }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setError(data?.message ?? "จองไม่สำเร็จ");
                return;
            }

            setSuccess("จองสำเร็จ! กำลังพาไปหน้าประวัติการจอง...");
            router.replace("/history");
            setTimeout(() => router.refresh(), 0);
        } catch {
            setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            {/* แสดง summary package */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm text-slate-500">แพ็กเกจที่เลือก</p>
                        <p className="text-lg font-semibold text-slate-900">{packageData?.name}</p>
                        {packageData?.boat?.name ? (
                            <p className="text-sm text-slate-600 mt-1">เรือ: {packageData.boat.name}</p>
                        ) : null}
                    </div>

                    {packageData?.price ? (
                        <div className="text-right">
                            <p className="text-sm text-slate-500">ราคา</p>
                            <p className="text-lg font-bold text-slate-900">{String(packageData.price)} ฿</p>
                        </div>
                    ) : null}
                </div>
                <p className="text-xs text-slate-500 mt-2">จำนวนคนสูงสุด: {max}</p>
            </div>

            {/* ฟอร์ม */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">วันที่ออกทริป</label>
                    <input
                        type="date"
                        className={inputBase}
                        value={tripDate}
                        onChange={(e) => setTripDate(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">จำนวนผู้โดยสาร</label>
                    <input
                        type="number"
                        className={inputBase}
                        min={1}
                        max={max}
                        value={passengerCount}
                        onChange={(e) => setPassengerCount(Number(e.target.value))}
                        disabled={loading}
                    />
                    <p className="text-xs text-slate-500 mt-1">ระหว่าง 1 - {max}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อผู้ติดต่อ</label>
                    <input
                        type="text"
                        className={inputBase}
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">เบอร์โทรผู้ติดต่อ</label>
                    <input
                        type="tel"
                        className={inputBase}
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">หมายเหตุเพิ่มเติม</label>
                    <input
                        type="text"
                        className={inputBase}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        disabled={loading}
                        placeholder="เช่น ขออาหารฮาลาล / มีเด็กเล็ก"
                    />
                </div>
            </div>

            {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            ) : null}

            {success ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <p className="text-sm text-emerald-700">{success}</p>
                </div>
            ) : null}

            <div className="flex justify-end">
                <button
                    onClick={submit}
                    disabled={loading || !canSubmit}
                    className="rounded-xl bg-sky-600 px-5 py-2.5 text-white font-semibold hover:bg-sky-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? "กำลังจอง..." : "ยืนยันการจอง"}
                </button>
            </div>
        </div>
    );
}