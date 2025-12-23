// app/admin/boats/BoatForm.client.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BoatForm() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [capacity, setCapacity] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    async function submit() {
        if (!name || !type || capacity <= 0) {
            alert("กรอกข้อมูลให้ครบ");
            return;
        }

        setLoading(true);
        await fetch("/api/admin/boats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, type, capacity }),
        });

        setLoading(false);
        setName("");
        setType("");
        setCapacity(0);
        router.refresh();
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <h2 className="font-semibold">เพิ่มเรือใหม่</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                    className="border rounded px-3 py-2"
                    placeholder="ชื่อเรือ"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className="border rounded px-3 py-2"
                    placeholder="ประเภท (Speedboat)"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                />
                <input
                    type="number"
                    className="border rounded px-3 py-2"
                    placeholder="ความจุ"
                    value={capacity || ""}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                />
            </div>

            <button
                onClick={submit}
                disabled={loading}
                className="rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
            >
                เพิ่มเรือ
            </button>
        </div>
    );
}
