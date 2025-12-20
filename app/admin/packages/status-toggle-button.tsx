"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
    packageId: number;
    currentStatus: string; // "active" | "inactive"
};

export default function StatusToggleButton({ packageId, currentStatus }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [errMsg, setErrMsg] = useState("");

    const nextStatus = currentStatus === "active" ? "inactive" : "active";

    function onToggle() {
        setErrMsg("");

        startTransition(async () => {
            const res = await fetch(`/api/admin/packages/${packageId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: nextStatus }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                setErrMsg(data?.message ?? "เปลี่ยนสถานะไม่สำเร็จ");
                return;
            }

            // รีเฟรชหน้าให้ดึงข้อมูลใหม่จาก server component
            router.refresh();
        });
    }

    return (
        <div className="inline-flex flex-col items-end gap-1">
            <button
                disabled={isPending}
                onClick={onToggle}
                className={
                    "px-3 py-1.5 rounded-lg text-xs font-semibold border transition disabled:opacity-60 " +
                    (nextStatus === "active"
                        ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50")
                }
            >
                {isPending ? "..." : nextStatus === "active" ? "Set Active" : "Set Inactive"}
            </button>

            {errMsg ? <span className="text-xs text-red-600">{errMsg}</span> : null}
        </div>
    );
}