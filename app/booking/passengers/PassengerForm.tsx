// app/booking/passengers/PassengerForm.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Passenger = {
    fname: string;
    lname: string;
    age: string; // string ในฟอร์ม แล้วค่อย cast เป็น number ตอนส่ง
    gender: "M" | "F" | "Other" | "";
};

type PackageInfo = {
    package_id: number;
    name: string;
    price: string; // Decimal จาก Prisma serialize เป็น string
    base_member_count: number;
    extra_price_per_person: string | null;
};

interface PassengerFormProps {
    packageId?: string;
    tripDate?: string;
    timeSlot: string;
    peopleFromPrev: number;
    boatId?: number;
}

export default function PassengerForm({
    packageId,
    tripDate,
    timeSlot,
    peopleFromPrev,
    boatId,
}: PassengerFormProps) {
    const router = useRouter();

    const [pkg, setPkg] = useState<PackageInfo | null>(null);
    const [passengers, setPassengers] = useState<Passenger[]>(() =>
        Array.from({ length: peopleFromPrev }, () => ({
            fname: "",
            lname: "",
            age: "",
            gender: "",
        }))
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // โหลดข้อมูลแพ็กเกจเพื่อคำนวณราคา / แสดงชื่อ
    useEffect(() => {
        if (!packageId) return;

        const fetchPackage = async () => {
            try {
                const res = await fetch(`/api/packages/${packageId}`);
                if (!res.ok) return;
                const data = await res.json();
                setPkg(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchPackage();
    }, [packageId]);

    // คำนวณราคารวม
    const totalPrice = useMemo(() => {
        if (!pkg) return 0;

        const basePrice = Number(pkg.price);
        const baseCount = pkg.base_member_count ?? 1;
        const extraPrice = pkg.extra_price_per_person
            ? Number(pkg.extra_price_per_person)
            : 0;

        const peopleCount = passengers.length;

        if (peopleCount <= baseCount || extraPrice === 0) {
            return basePrice;
        }

        const extraPeople = peopleCount - baseCount;
        return basePrice + extraPeople * extraPrice;
    }, [pkg, passengers.length]);

    const handlePassengerChange = (
        index: number,
        field: keyof Passenger,
        value: string
    ) => {
        setPassengers((prev) => {
            const newPassengers = [...prev];
            newPassengers[index] = { ...newPassengers[index], [field]: value };
            return newPassengers;
        });
    };

    const handleAddPassenger = () => {
        setPassengers((prev) => [
            ...prev,
            { fname: "", lname: "", age: "", gender: "" },
        ]);
    };

    const handleRemovePassenger = (index: number) => {
        if (passengers.length <= 1) return;
        setPassengers((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setErrorMessage(null);

        if (!packageId || !tripDate) {
            setErrorMessage("ข้อมูลการจองไม่ครบ กรุณากลับไปเลือกแพ็กเกจใหม่อีกครั้ง");
            return;
        }

        // validate ฟิลด์ผู้โดยสาร
        for (const [i, p] of passengers.entries()) {
            if (
                !p.fname.trim() ||
                !p.lname.trim() ||
                !p.age.trim() ||
                !p.gender
            ) {
                setErrorMessage(`กรุณากรอกข้อมูลผู้โดยสารคนที่ ${i + 1} ให้ครบ`);
                return;
            }
        }

        setIsSubmitting(true);

        try {
            const body = {
                packageId: Number(packageId),
                tripDate,
                timeSlot,
                people: passengers.length,
                boatId,
                passengers: passengers.map((p) => ({
                    fname: p.fname.trim(),
                    lname: p.lname.trim(),
                    age: Number(p.age),
                    gender: p.gender,
                })),
            };

            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                console.error(data);
                setErrorMessage(
                    data?.message ?? data?.error ?? "จองไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"
                );
                return;
            }

            // ไม่ต้องลบอะไร เพราะเราไม่ได้เก็บ sessionStorage แล้ว
            router.push("/history");
        } catch (err) {
            console.error(err);
            setErrorMessage("เกิดข้อผิดพลาดระหว่างการจอง กรุณาลองใหม่อีกครั้ง");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 pt-28 pb-16 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                            กรอกข้อมูลผู้โดยสาร
                        </h1>
                        {pkg && (
                            <p className="text-sm text-slate-600 mt-1">
                                แพ็กเกจ:{" "}
                                <span className="font-semibold text-slate-900">
                                    {pkg.name}
                                </span>
                            </p>
                        )}
                        <p className="text-sm text-slate-500">
                            วันที่เดินทาง:{" "}
                            <span className="font-medium text-slate-800">
                                {tripDate ?? "-"}
                            </span>{" "}
                            | รอบ:{" "}
                            <span className="font-medium text-slate-800">
                                {timeSlot}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-[2fr,1.2fr] gap-6 md:items-start">
                    {/* ฟอร์มผู้โดยสาร */}
                    <div className="space-y-4">
                        {/* error message */}
                        {errorMessage && (
                            <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm">
                                {errorMessage}
                            </div>
                        )}

                        {/* ฟอร์มผู้โดยสาร */}
                        <div className="space-y-4">
                            {passengers.map((p, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl shadow border border-slate-100 p-4 md:p-5 space-y-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <h2 className="font-semibold text-slate-900">
                                            ผู้โดยสารคนที่ {index + 1}
                                        </h2>
                                        {passengers.length > 1 && (
                                            <button
                                                type="button"
                                                className="text-xs text-rose-500 hover:text-rose-600"
                                                onClick={() => handleRemovePassenger(index)}
                                            >
                                                ลบ
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                                ชื่อจริง
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-600"
                                                value={p.fname}
                                                onChange={(e) =>
                                                    handlePassengerChange(
                                                        index,
                                                        "fname",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                                นามสกุล
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-600"
                                                value={p.lname}
                                                onChange={(e) =>
                                                    handlePassengerChange(
                                                        index,
                                                        "lname",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                                อายุ
                                            </label>
                                            <input
                                                type="number"
                                                min={1}
                                                className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-600"
                                                value={p.age}
                                                onChange={(e) =>
                                                    handlePassengerChange(
                                                        index,
                                                        "age",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                                เพศ
                                            </label>
                                            <select
                                                className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-600"
                                                value={p.gender}
                                                onChange={(e) =>
                                                    handlePassengerChange(
                                                        index,
                                                        "gender",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">เลือกเพศ</option>
                                                <option value="M">ชาย</option>
                                                <option value="F">หญิง</option>
                                                <option value="Other">อื่น ๆ</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            className="text-sm text-sky-600 font-medium hover:text-sky-700"
                            onClick={handleAddPassenger}
                        >
                            + เพิ่มผู้โดยสารอีก
                        </button>
                    </div>

                    {/* กล่องสรุปด้านข้าง */}
                    <div className="bg-white/90 rounded-2xl border border-slate-100 shadow-sm p-4 md:p-5 space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900">
                            สรุปการเดินทาง
                        </h3>
                        <div className="space-y-1 text-sm text-slate-700">
                            <p>
                                วันที่:{" "}
                                <span className="font-medium">
                                    {tripDate ?? "-"}
                                </span>
                            </p>
                            <p>
                                รอบ:{" "}
                                <span className="font-medium">
                                    {timeSlot}
                                </span>
                            </p>
                            <p>
                                จำนวนผู้โดยสาร:{" "}
                                <span className="font-medium">
                                    {passengers.length} คน
                                </span>
                            </p>
                        </div>

                        <div className="border-t border-slate-100 pt-4 mt-2 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">ราคารวมทั้งหมด</span>
                                <span className="font-semibold text-slate-900">
                                    {totalPrice.toLocaleString()} บาท
                                </span>
                            </div>
                        </div>

                        <div className="pt-3 space-y-3">
                            <div className="flex items-center justify-between mt-6">
                                <button
                                    type="button"
                                    className="text-sm text-slate-600 hover:underline"
                                    onClick={() => {
                                        const params = new URLSearchParams({
                                            package_id: packageId ?? "",
                                            tripDate: tripDate ?? "",
                                            timeSlot,
                                            people: String(passengers.length),
                                        });

                                        router.push(`/booking?${params.toString()}`);
                                    }}
                                >
                                    ← กลับไปแก้ไขข้อมูลการจอง
                                </button>
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
                                    onClick={handleSubmit}
                                >
                                    {isSubmitting ? "กำลังบันทึก..." : "ยืนยันการจอง"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}