// app/(public)/package/PackageList.client.tsx
"use client";

import { useMemo, useState } from "react";
import TourCard from "@/components/TourCard";
import PackageDetailModal from "@/components/package/PackageDetailModal.client";

type PackageItem = {
    package_id: number;
    name: string;
    package_pic?: string | null;
    description?: string | null;
    duration_minutes?: number | null;
    price?: number | string | null;
    type?: string | null;
};

function formatDuration(minutes?: number | null) {
    if (!minutes) return "-";
    const h = Math.floor(Number(minutes) / 60);
    if (h >= 1) return `${h} ชั่วโมง`;
    return `${minutes} นาที`;
}

export default function PackageListClient({ packages }: { packages: PackageItem[] }) {
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const selected = useMemo(() => {
        if (!selectedId) return null;
        return (packages ?? []).find((p) => p.package_id === selectedId) ?? null;
    }, [packages, selectedId]);

    const onDetails = (package_id: number) => {
        setSelectedId(package_id);
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
        setSelectedId(null);
    };

    if (!packages || packages.length === 0) {
        return (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
                ยังไม่มีแพ็กเกจให้แสดง
            </div>
        );
    }

    return (
        <>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                    <TourCard
                        key={pkg.package_id}
                        package_id={pkg.package_id}
                        image={pkg.package_pic || "/hero.jpg"}
                        title={pkg.name}
                        price={pkg.price ?? "-"}
                        unit={pkg.type === "JOIN_GROUP" ? "/คน" : "/ทริป"}
                        meta={`ระยะเวลา: ${formatDuration(pkg.duration_minutes)}`}
                        onDetails={onDetails}
                    />
                ))}
            </div>

            <PackageDetailModal
                open={open}
                onClose={onClose}
                image={selected?.package_pic || "/hero.jpg"}
                title={selected?.name || ""}
                durationText={formatDuration(selected?.duration_minutes)}
                description={selected?.description || "ไม่มีรายละเอียด"}
            />
        </>
    );
}