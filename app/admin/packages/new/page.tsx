"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type BoatOption = {
    boat_id: number;
    name: string;
    capacity: number;
    is_active: boolean;
};

export default function AdminCreatePackagePage() {
    const router = useRouter();

    const [boats, setBoats] = useState<BoatOption[]>([]);
    const activeBoats = useMemo(() => boats.filter((b) => b.is_active), [boats]);

    // form
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [price, setPrice] = useState<number>(2500);
    const [boatId, setBoatId] = useState<string>(""); // keep as string for select

    const [type, setType] = useState<"PRIVATE" | "JOIN">("PRIVATE");
    const [timeSlot, setTimeSlot] = useState<"MORNING" | "AFTERNOON">("MORNING");

    const [time, setTime] = useState<string>("240"); // minutes
    const [spotCount, setSpotCount] = useState<string>("3");
    const [extraPrice, setExtraPrice] = useState<string>("0");

    const [status, setStatus] = useState<"active" | "inactive">("inactive");

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        (async () => {
            const res = await fetch("/api/admin/boats", { credentials: "include" });
            const data = await res.json().catch(() => null);
            setBoats(data?.boats ?? []);
        })();
    }, []);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (submitting) return;

        setError("");
        setSubmitting(true);

        try {
            const payload = {
                name,
                description,
                price,
                boat_id: boatId ? Number(boatId) : null,
                type,
                time_slot: timeSlot,
                time: time.trim() === "" ? null : Number(time),
                spot_count: spotCount.trim() === "" ? null : Number(spotCount),
                extra_price_per_person: extraPrice.trim() === "" ? null : Number(extraPrice),
                status,
            };

            const res = await fetch("/api/admin/packages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setError(data?.message ?? "สร้าง Package ไม่สำเร็จ");
                return;
            }

            router.replace("/admin/packages");
            router.refresh();
        } catch {
            setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">สร้าง Package ใหม่</h1>
                <p className="text-slate-600 mt-1">
                    หน้านี้ใช้พื้นที่เต็มมากขึ้น เพื่อกรอกข้อมูลได้สะดวก
                </p>
            </div>

            <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* ทำให้ดู “เต็มหน้า” ด้วย padding ใหญ่ + grid 2 คอลัมน์ */}
                <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อแพ็กเกจ</label>
                                <input
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={submitting}
                                    placeholder="เช่น เกาะทะลุ (เต็มวัน)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    className="w-full min-h-[140px] rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    disabled={submitting}
                                    placeholder="รายละเอียดทริป/สิ่งที่รวม/เงื่อนไข ฯลฯ"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">ราคา</label>
                                    <input
                                        type="number"
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                                        value={price}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        disabled={submitting}
                                        min={1}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">สถานะ</label>
                                    <select
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as any)}
                                        disabled={submitting}
                                    >
                                        <option value="inactive">inactive</option>
                                        <option value="active">active</option>
                                    </select>
                                    <p className="text-xs text-slate-500 mt-1">active = แสดงฝั่ง user</p>
                                </div>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                    <select
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                                        value={type}
                                        onChange={(e) => setType(e.target.value as any)}
                                        disabled={submitting}
                                    >
                                        <option value="PRIVATE">PRIVATE</option>
                                        <option value="JOIN">JOIN</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Time Slot</label>
                                    <select
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                                        value={timeSlot}
                                        onChange={(e) => setTimeSlot(e.target.value as any)}
                                        disabled={submitting}
                                    >
                                        <option value="MORNING">เช้า</option>
                                        <option value="AFTERNOON">บ่าย</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Boat (เลือกได้เฉพาะ active)</label>
                                <select
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                                    value={boatId}
                                    onChange={(e) => setBoatId(e.target.value)}
                                    disabled={submitting}
                                >
                                    <option value="">— ไม่ผูกเรือ —</option>
                                    {activeBoats.map((b) => (
                                        <option key={b.boat_id} value={String(b.boat_id)}>
                                            {b.name} (cap {b.capacity})
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-slate-500 mt-1">
                                    ถ้าผูกเรือแล้ว คุณสามารถใช้ capacity ของเรือเป็น max คนของแพ็กเกจได้
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Duration (นาที)</label>
                                    <input
                                        type="number"
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        disabled={submitting}
                                        min={1}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Spot Count</label>
                                    <input
                                        type="number"
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                                        value={spotCount}
                                        onChange={(e) => setSpotCount(e.target.value)}
                                        disabled={submitting}
                                        min={0}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Extra / คน</label>
                                    <input
                                        type="number"
                                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                                        value={extraPrice}
                                        onChange={(e) => setExtraPrice(e.target.value)}
                                        disabled={submitting}
                                        min={0}
                                    />
                                </div>
                            </div>

                            {error ? (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            ) : null}

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting || !name || price <= 0}
                                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {submitting ? "กำลังบันทึก..." : "สร้าง Package"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    disabled={submitting}
                                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    ย้อนกลับ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}