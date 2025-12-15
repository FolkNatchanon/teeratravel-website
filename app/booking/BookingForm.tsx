// app/booking/BookingForm.tsx
"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type BoatOption = {
    boatId: number;
    name: string;
    type: string;
    capacity: number;
    extraPrivatePrice: number; // ส่วนเพิ่มจากราคา base ถ้าเลือกเรือลำนี้
};

type Props = {
    packageId: number;
    packageName: string;
    packageType: "PRIVATE" | "JOIN";
    basePrice: number;
    baseMemberCount: number;
    extraPricePerPerson: number | null;
    boats: BoatOption[];
};

type MessageState = {
    type: "success" | "error";
    text: string;
} | null;

export default function BookingForm({
    packageId,
    packageName,
    packageType,
    basePrice,
    baseMemberCount,
    extraPricePerPerson,
    boats,
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // ✅ ดึงค่าที่เคยเลือก (เวลา user กด Back จากหน้า passengers กลับมา)
    const [tripDate, setTripDate] = useState<string>(
        searchParams.get("tripDate") ?? ""
    );
    const [timeSlot, setTimeSlot] = useState<string>(
        searchParams.get("timeSlot") ?? "เช้า"
    );
    const [people, setPeople] = useState<number>(() => {
        const p = searchParams.get("people");
        return p ? Number(p) || 1 : baseMemberCount || 2; // default = จำนวนคนตาม base หรือ 2 คน
    });

    const [selectedBoatId, setSelectedBoatId] = useState<number>(() => {
        const fromQuery = searchParams.get("boatId");
        if (fromQuery) {
            const parsed = Number(fromQuery);
            if (!Number.isNaN(parsed)) return parsed;
        }
        // ถ้ายังไม่ได้เลือกมาก่อน → เอาเรือลำแรกเป็น default (ถ้ามี)
        return boats.length > 0 ? boats[0].boatId : 0;
    });

    const [message, setMessage] = useState<MessageState>(null);

    const selectedBoat: BoatOption | null = useMemo(
        () =>
            boats.find((b) => b.boatId === selectedBoatId) ??
            (boats.length > 0 ? boats[0] : null),
        [boats, selectedBoatId]
    );

    // ✅ สูตรคำนวณราคา
    // - ถ้าเป็น PRIVATE:
    //   - basePrice = ราคาเหมาลำ ครอบคลุม baseMemberCount คนแรก
    //   - ถ้า people <= baseMemberCount → ราคา *ส่วนคน* = basePrice (ห้ามเกิน)
    //   - ถ้า people > baseMemberCount → basePrice + (people - baseMemberCount) * extraPricePerPerson
    //   - แล้วค่อย + extraPrivatePrice ของเรือลำที่เลือก
    //
    // - ถ้าเป็น JOIN:
    //   - basePrice = ราคาต่อคน → total = basePrice * people (ยังไม่รองรับ JoinTrip รอบจริงใน step นี้)
    const totalPrice = useMemo(() => {
        const extraPerPerson = extraPricePerPerson ?? 0;
        const includedPeople = baseMemberCount || 1;

        let peoplePrice = 0;

        if (packageType === "PRIVATE") {
            if (people <= includedPeople) {
                peoplePrice = basePrice; // ❗ ยังไม่เกินจำนวนเหมารวม → ราคาไม่เกิน basePrice
            } else {
                const extraPeople = people - includedPeople;
                peoplePrice = basePrice + extraPeople * extraPerPerson;
            }
        } else {
            // JOIN: ราคา/คน ตรง ๆ
            peoplePrice = basePrice * people;
        }

        const boatExtra = selectedBoat?.extraPrivatePrice ?? 0;

        return peoplePrice + boatExtra;
    }, [
        packageType,
        basePrice,
        baseMemberCount,
        extraPricePerPerson,
        people,
        selectedBoat,
    ]);

    function handleChangePeople(delta: number) {
        setPeople((prev) => {
            const next = prev + delta;
            return next < 1 ? 1 : next;
        });
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setMessage(null);

        if (!tripDate) {
            setMessage({
                type: "error",
                text: "กรุณาเลือกวันที่เดินทาง",
            });
            return;
        }

        if (!people || people < 1) {
            setMessage({
                type: "error",
                text: "จำนวนผู้เดินทางต้องมากกว่า 0",
            });
            return;
        }

        if (!selectedBoat) {
            setMessage({
                type: "error",
                text: "กรุณาเลือกเรือที่ต้องการใช้ในทริป",
            });
            return;
        }

        if (people > selectedBoat.capacity) {
            setMessage({
                type: "error",
                text: `จำนวนผู้เดินทาง (${people} คน) เกินความจุของเรือลำนี้ (สูงสุด ${selectedBoat.capacity} คน)`,
            });
            return;
        }

        // เตรียม query ส่งไปหน้า /booking/passengers
        const params = new URLSearchParams({
            packageId: String(packageId),
            tripDate,
            timeSlot,
            people: String(people),
            boatId: String(selectedBoat.boatId),
            // ส่งราคาโดยประมาณไปด้วย (เผื่อเอาไปโชว์ใน step ถัดไป)
            estimatedPrice: String(totalPrice),
        });

        router.push(`/booking/passengers?${params.toString()}`);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* กล่องสรุปแพ็กเกจ */}
            <div className="rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3">
                <p className="font-semibold text-slate-900">{packageName}</p>
                <p className="text-sm text-slate-600 mt-1">
                    {packageType === "PRIVATE" ? (
                        <>
                            ราคาเหมาลำเริ่มต้น{" "}
                            <span className="font-semibold text-sky-800">
                                ฿{basePrice.toLocaleString()}
                            </span>{" "}
                            สำหรับ{" "}
                            <span className="font-semibold">
                                {baseMemberCount} คนแรก
                            </span>
                        </>
                    ) : (
                        <>
                            ราคาต่อคน{" "}
                            <span className="font-semibold text-sky-800">
                                ฿{basePrice.toLocaleString()}
                            </span>
                        </>
                    )}
                </p>
                {packageType === "PRIVATE" && extraPricePerPerson && (
                    <p className="text-xs text-slate-500 mt-1">
                        คนที่เกินจาก {baseMemberCount} คนแรก คิดเพิ่มคนละ{" "}
                        ฿{extraPricePerPerson.toLocaleString()}
                    </p>
                )}
            </div>

            {/* เลือกวันที่ / ช่วงเวลา */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="tripDate"
                        className="text-sm font-medium text-slate-800"
                    >
                        วันที่เดินทาง
                    </label>
                    <input
                        id="tripDate"
                        type="date"
                        className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
                        value={tripDate}
                        onChange={(e) => setTripDate(e.target.value)}
                    />
                    <p className="text-[11px] text-slate-500">
                        กรุณาเลือกวันเดินทางตามที่ตกลงกับทีมงาน หรือดูรอบว่างก่อนจอง
                    </p>
                </div>

                <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-slate-800">
                        ช่วงเวลาออกทริป
                    </span>
                    <div className="flex gap-2">
                        {["เช้า", "บ่าย"].map((slot) => (
                            <button
                                key={slot}
                                type="button"
                                onClick={() => setTimeSlot(slot)}
                                className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${timeSlot === slot
                                    ? "border-sky-600 bg-sky-50 text-sky-800"
                                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                    <p className="text-[11px] text-slate-500">
                        เวลาจริงอาจมีการปรับตามสภาพอากาศ และการจัดรอบเรือ
                    </p>
                </div>
            </div>

            {/* จำนวนผู้เดินทาง + เรือที่ใช้ */}
            <div className="grid gap-4 sm:grid-cols-2 items-start">
                {/* จำนวนผู้เดินทาง */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-800" htmlFor="people">
                        จำนวนผู้เดินทาง
                    </label>
                    <div className="inline-flex items-center rounded-xl border border-slate-300 bg-white">
                        <button
                            type="button"
                            onClick={() => handleChangePeople(-1)}
                            className="px-3 py-2 text-lg font-semibold border-r border-slate-200 hover:bg-slate-50"
                        >
                            −
                        </button>
                        <input
                            id="people"
                            type="number"
                            min={1}
                            className="w-16 text-center border-none focus:outline-none focus:ring-0 text-sm text-slate-800"
                            value={people}
                            onChange={(e) =>
                                setPeople(Math.max(1, Number(e.target.value) || 1))
                            }
                        />
                        <button
                            type="button"
                            onClick={() => handleChangePeople(1)}
                            className="px-3 py-2 text-lg font-semibold border-l border-slate-200 hover:bg-slate-50"
                        >
                            +
                        </button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                        ระบบจะคำนวณราคาโดยประมาณให้ตามจำนวนคนและเรือที่เลือก
                    </p>
                </div>

                {/* เลือกเรือ */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-slate-800">
                        เลือกเรือสำหรับทริปนี้
                    </span>
                    {boats.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            ตอนนี้ยังไม่มีเรือที่เปิดให้ใช้งาน โปรดติดต่อแอดมิน
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {boats.map((boat) => {
                                const isSelected = boat.boatId === selectedBoatId;
                                return (
                                    <button
                                        key={boat.boatId}
                                        type="button"
                                        onClick={() => setSelectedBoatId(boat.boatId)}
                                        className={`w-full text-left rounded-xl border px-3 py-2.5 text-sm transition ${isSelected
                                            ? "border-sky-600 bg-sky-50"
                                            : "border-slate-300 bg-white hover:bg-slate-50"
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    {boat.name}
                                                </p>
                                                <p className="text-[11px] text-slate-500">
                                                    ประเภท {boat.type} • ความจุสูงสุด {boat.capacity} คน
                                                </p>
                                            </div>
                                            {packageType === "PRIVATE" && (
                                                <p className="text-xs text-slate-700">
                                                    {boat.extraPrivatePrice === 0
                                                        ? "ไม่บวกเพิ่มจากราคาเหมาลำ"
                                                        : `+ ฿${boat.extraPrivatePrice.toLocaleString()}`}
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ราคารวมโดยประมาณ */}
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
                <p className="text-xs font-semibold text-amber-800 mb-1">
                    ราคารวมโดยประมาณ
                </p>
                <p className="text-xl font-bold text-amber-900">
                    ฿{totalPrice.toLocaleString()}
                </p>
                <p className="text-[11px] text-amber-800/80 mt-1">
                    ราคานี้เป็นการคำนวณเบื้องต้นจากจำนวนคนและเรือที่เลือก
                    ราคาจริงจะยืนยันอีกครั้งโดยทีมงานก่อนออกทริป
                </p>
            </div>

            {/* แสดงข้อความแจ้งเตือน */}
            {message && (
                <div
                    className={`text-sm rounded-xl px-3 py-2 ${message.type === "error"
                        ? "bg-red-50 text-red-700 border border-red-100"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* ปุ่มไปกรอกผู้โดยสาร */}
            <div className="pt-1">
                <button
                    type="submit"
                    className="w-full md:w-auto inline-flex justify-center items-center rounded-full px-5 py-2.5 text-sm font-semibold bg-sky-600 text-white hover:bg-sky-700 active:scale-[.99] transition"
                >
                    ดำเนินการต่อ → กรอกข้อมูลผู้โดยสาร
                </button>
            </div>
        </form>
    );
}