"use client";

import { useTransition } from "react";

type Props = {
    bookingId: number;
    currentStatus: string;
};

export default function StatusButtons({ bookingId, currentStatus }: Props) {
    const [isPending, startTransition] = useTransition();

    async function updateStatus(status: string) {
        startTransition(async () => {
            await fetch(`/api/admin/bookings/${bookingId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            // ให้หน้า server component ดึงข้อมูลใหม่ (ง่ายสุดคือ reload)
            window.location.reload();
        });
    }

    const isConfirmed = currentStatus === "confirmed";
    const isCancelled = currentStatus === "cancelled";

    return (
        <div className="flex gap-2">
            <button
                disabled={isPending || isConfirmed}
                onClick={() => updateStatus("confirmed")}
                className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-50"
            >
                Confirm
            </button>

            <button
                disabled={isPending || isCancelled}
                onClick={() => updateStatus("cancelled")}
                className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
            >
                Cancel
            </button>
        </div>
    );
}