"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PackageStatusToggleButton({
    packageId,
    currentStatus,
}: {
    packageId: number;
    currentStatus: "active" | "inactive";
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const nextStatus = currentStatus === "active" ? "inactive" : "active";

    async function toggle() {
        if (loading) return;
        setLoading(true);
        try {
            await fetch(`/api/admin/packages/${packageId}/status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status: nextStatus }),
            });
            router.refresh();
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={toggle}
            disabled={loading}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
            {loading ? "..." : nextStatus === "active" ? "Set Active" : "Set Inactive"}
        </button>
    );
}