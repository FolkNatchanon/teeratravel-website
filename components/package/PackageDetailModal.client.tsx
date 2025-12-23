// components/package/PackageDetailModal.client.tsx
"use client";

import { useEffect } from "react";

type Props = {
    open: boolean;
    onClose: () => void;

    image: string;
    title: string;
    durationText: string;
    description: string;
};

export default function PackageDetailModal({
    open,
    onClose,
    image,
    title,
    durationText,
    description,
}: Props) {
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", onKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100]">
            {/* backdrop เบลอ + คลิกปิด */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* modal */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
                    <div className="relative h-56 sm:h-72 w-full bg-slate-100">
                        <img src={image} alt={title} className="h-full w-full object-cover" />

                        <button
                            type="button"
                            onClick={onClose}
                            className="absolute top-3 right-3 rounded-full bg-white/90 hover:bg-white text-slate-700 w-9 h-9 flex items-center justify-center shadow"
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h2>
                            <p className="text-slate-600 mt-1">
                                ระยะเวลา: <b>{durationText}</b>
                            </p>
                        </div>

                        <div className="border-t border-slate-200 pt-4">
                            <h3 className="font-semibold text-slate-900">รายละเอียด</h3>
                            <p className="text-slate-700 mt-2 whitespace-pre-line">{description}</p>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-700 font-semibold hover:bg-slate-50 transition"
                            >
                                ย้อนกลับ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}