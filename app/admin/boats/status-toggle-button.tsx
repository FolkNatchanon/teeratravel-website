// app/admin/boats/status-toggle-button.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
    boatId: number;
    currentActive: boolean;
};

export default function StatusToggleButton({ boatId, currentActive }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function toggle() {
        if (loading) return;
        setLoading(true);

        try {
            const res = await fetch("/api/admin/boats/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    boat_id: boatId,
                    is_active: !currentActive,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                alert(data?.message ?? "Toggle failed");
                return;
            }

            router.refresh();
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={toggle}
            disabled={loading}
            className={
                "inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition " +
                (currentActive
                    ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100") +
                (loading ? " opacity-60 cursor-not-allowed" : "")
            }
        >
            {loading ? "..." : currentActive ? "Deactivate" : "Activate"}
        </button>
    );
}
