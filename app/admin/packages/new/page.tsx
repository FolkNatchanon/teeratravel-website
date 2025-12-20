"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const CATEGORY_OPTIONS = ["FULL_TALU", "SHORT_TALU", "FULL_REMOTE", "JOIN_GROUP"] as const;
const TYPE_OPTIONS = ["PRIVATE", "JOIN"] as const;
const STATUS_OPTIONS = ["inactive", "active"] as const;

export default function AdminCreatePackagePage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [packagePic, setPackagePic] = useState(""); // เก็บเป็นชื่อไฟล์ เช่น "talu.jpg"
    const [type, setType] = useState<(typeof TYPE_OPTIONS)[number]>("PRIVATE");
    const [category, setCategory] = useState<(typeof CATEGORY_OPTIONS)[number]>("FULL_TALU");
    const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>("inactive");

    const [durationMinutes, setDurationMinutes] = useState("");
    const [maxParticipants, setMaxParticipants] = useState("");
    const [baseMemberCount, setBaseMemberCount] = useState("1");

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (isSubmitting) return;

        setError("");
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/admin/packages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    description: description || null,
                    price,
                    package_pic: packagePic || null,
                    type,
                    category,
                    status,
                    duration_minutes: durationMinutes ? Number(durationMinutes) : null,
                    max_participants: maxParticipants ? Number(maxParticipants) : null,
                    base_member_count: baseMemberCount ? Number(baseMemberCount) : 1,
                }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setError(data?.message ?? "สร้าง Package ไม่สำเร็จ");
                return;
            }

            router.replace("/admin/packages");
            router.refresh();
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">สร้าง Package</h1>
                <p className="text-sm text-slate-500">
                    ถ้าตั้ง status = <b>active</b> จะไปขึ้นหน้า user (/package) เป็น TourCard อัตโนมัติ
                </p>
            </div>

            <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="เช่น Full Trip เกาะทะลุ 3 จุด"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 min-h-[120px]"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="รายละเอียดแพ็กเกจ"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                        <input
                            type="number"
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="เช่น 1599"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Package Pic (ชื่อไฟล์)</label>
                        <input
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800"
                            value={packagePic}
                            onChange={(e) => setPackagePic(e.target.value)}
                            placeholder='เช่น "talu.jpg" (อยู่ใน /public/images/)'
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                        <select
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800"
                            value={type}
                            onChange={(e) => setType(e.target.value as any)}
                        >
                            {TYPE_OPTIONS.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                        <select
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as any)}
                        >
                            {CATEGORY_OPTIONS.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                        <select
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as any)}
                        >
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Duration (minutes)</label>
                        <input
                            type="number"
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800"
                            value={durationMinutes}
                            onChange={(e) => setDurationMinutes(e.target.value)}
                            placeholder="เช่น 240"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Max participants</label>
                        <input
                            type="number"
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800"
                            value={maxParticipants}
                            onChange={(e) => setMaxParticipants(e.target.value)}
                            placeholder="เช่น 10"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Base member count</label>
                        <input
                            type="number"
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800"
                            value={baseMemberCount}
                            onChange={(e) => setBaseMemberCount(e.target.value)}
                            placeholder="เช่น 1"
                        />
                    </div>
                </div>

                {error && (
                    <div className="border border-red-200 bg-red-50 text-red-700 rounded-lg px-4 py-3 text-sm">
                        {error}
                    </div>
                )}

                <button
                    disabled={isSubmitting || !name || !price}
                    className="w-full bg-slate-900 text-white rounded-lg py-2.5 font-semibold hover:bg-slate-800 disabled:opacity-60"
                >
                    {isSubmitting ? "กำลังสร้าง..." : "Create Package"}
                </button>
            </form>
        </div>
    );
}