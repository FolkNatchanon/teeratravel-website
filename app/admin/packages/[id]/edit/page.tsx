"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PackageData = {
    package_id: number;
    name: string;
    description: string | null;
    price: any; // Decimal อาจเป็น string/number ตอนส่ง JSON
    package_pic: string | null;
    type: string;
    category: string;
    status: string;
    boat_id: number | null;

    main_location: string | null;
    spot_count: number | null;
    duration_minutes: number | null;
    max_participants: number | null;

    base_member_count: number | null;
    extra_price_per_person: any | null;

    includes_left: string | null;
    includes_right: string | null;
};

export default function AdminEditPackagePage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const packageId = Number(params.id);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        package_pic: "",
        type: "PRIVATE",
        category: "FULL_TALU",
        status: "inactive",

        boat_id: "",
        main_location: "",
        spot_count: "",
        duration_minutes: "",
        max_participants: "",
        base_member_count: "1",
        extra_price_per_person: "",
        includes_left: "",
        includes_right: "",
    });

    useEffect(() => {
        if (!Number.isFinite(packageId)) {
            setError("Invalid package id");
            setLoading(false);
            return;
        }

        (async () => {
            setLoading(true);
            setError("");

            const res = await fetch(`/api/admin/packages/${packageId}`, { method: "GET" });
            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setError(data?.message ?? "โหลดข้อมูลไม่สำเร็จ");
                setLoading(false);
                return;
            }

            const p: PackageData = data.package;

            setForm({
                name: p.name ?? "",
                description: p.description ?? "",
                price: String(p.price ?? ""),
                package_pic: p.package_pic ?? "",
                type: p.type ?? "PRIVATE",
                category: p.category ?? "FULL_TALU",
                status: p.status ?? "inactive",

                boat_id: p.boat_id === null ? "" : String(p.boat_id),
                main_location: p.main_location ?? "",
                spot_count: p.spot_count === null ? "" : String(p.spot_count),
                duration_minutes: p.duration_minutes === null ? "" : String(p.duration_minutes),
                max_participants: p.max_participants === null ? "" : String(p.max_participants),
                base_member_count: p.base_member_count === null ? "1" : String(p.base_member_count),
                extra_price_per_person: p.extra_price_per_person === null ? "" : String(p.extra_price_per_person),
                includes_left: p.includes_left ?? "",
                includes_right: p.includes_right ?? "",
            });

            setLoading(false);
        })();
    }, [packageId]);

    function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (saving) return;

        setSaving(true);
        setError("");

        const res = await fetch(`/api/admin/packages/${packageId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                // แปลงค่าให้ API ใช้ง่าย (ถ้าช่องว่างให้เป็น null)
                boat_id: form.boat_id === "" ? null : Number(form.boat_id),
                spot_count: form.spot_count === "" ? null : Number(form.spot_count),
                duration_minutes: form.duration_minutes === "" ? null : Number(form.duration_minutes),
                max_participants: form.max_participants === "" ? null : Number(form.max_participants),
                base_member_count: form.base_member_count === "" ? null : Number(form.base_member_count),
                extra_price_per_person: form.extra_price_per_person === "" ? null : String(form.extra_price_per_person),
            }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
            setError(data?.message ?? "บันทึกไม่สำเร็จ");
            setSaving(false);
            return;
        }

        // กลับไปหน้า list + refresh ให้เห็นค่าที่แก้
        router.replace("/admin/packages");
        router.refresh();
    }

    if (loading) {
        return <div className="text-slate-600">กำลังโหลด...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">แก้ไข Package #{packageId}</h1>
                    <p className="text-sm text-slate-500">
                        แก้ไขข้อมูลแล้วกดบันทึก (ถ้า status = active จะขึ้นหน้า user เป็น TourCard)
                    </p>
                </div>

                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                    ย้อนกลับ
                </button>
            </div>

            <form onSubmit={onSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800"
                        value={form.name}
                        onChange={(e) => setField("name", e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 min-h-[120px]"
                        value={form.description}
                        onChange={(e) => setField("description", e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                        <input
                            type="number"
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800"
                            value={form.price}
                            onChange={(e) => setField("price", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Package Pic (ชื่อไฟล์)</label>
                        <input
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800"
                            value={form.package_pic}
                            onChange={(e) => setField("package_pic", e.target.value)}
                            placeholder='เช่น "talu.jpg"'
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                        <select
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800"
                            value={form.type}
                            onChange={(e) => setField("type", e.target.value)}
                        >
                            <option value="PRIVATE">PRIVATE</option>
                            <option value="JOIN">JOIN</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                        <input
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800"
                            value={form.category}
                            onChange={(e) => setField("category", e.target.value)}
                        />
                        <p className="text-xs text-slate-500 mt-1">ใส่ให้ตรง enum ที่ใช้ใน schema</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                        <select
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800"
                            value={form.status}
                            onChange={(e) => setField("status", e.target.value)}
                        >
                            <option value="inactive">inactive</option>
                            <option value="active">active</option>
                        </select>
                    </div>
                </div>

                {/* เพิ่มฟิลด์อื่น ๆ ได้ตามต้องการ */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Duration (minutes)</label>
                        <input
                            type="number"
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800"
                            value={form.duration_minutes}
                            onChange={(e) => setField("duration_minutes", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Max participants</label>
                        <input
                            type="number"
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800"
                            value={form.max_participants}
                            onChange={(e) => setField("max_participants", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Base member count</label>
                        <input
                            type="number"
                            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800"
                            value={form.base_member_count}
                            onChange={(e) => setField("base_member_count", e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <div className="border border-red-200 bg-red-50 text-red-700 rounded-lg px-4 py-3 text-sm">
                        {error}
                    </div>
                )}

                <button
                    disabled={saving}
                    className="w-full bg-slate-900 text-white rounded-lg py-2.5 font-semibold hover:bg-slate-800 disabled:opacity-60"
                >
                    {saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                </button>
            </form>
        </div>
    );
}