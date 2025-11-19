import Link from "next/link";
import { CalendarDays, Clock, Users } from "lucide-react";
import { prisma } from "../lib/prisma";

function formatDateTH(date: Date) {
    // แสดงเป็น 13/09/2568
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear() + 543;
    return `${d}/${m}/${y}`;
}

const statusLabel: Record<string, string> = {
    pending: "รอตรวจสอบ",
    confirmed: "ยืนยันแล้ว",
    cancelled: "ยกเลิก",
};

const statusStyle: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 border border-amber-300",
    confirmed: "bg-emerald-100 text-emerald-700 border border-emerald-300",
    cancelled: "bg-rose-100 text-rose-700 border border-rose-300",
};

export default async function BookingHistoryPage() {
    // TODO: เปลี่ยนเป็น user ที่ล็อกอินจริง
    const USER_ID = 1;

    const bookings = await prisma.booking.findMany({
        where: { user_id: USER_ID },
        include: {
            package: true,
        },
        orderBy: { trip_date: "desc" },
    });

    return (
        <main className="min-h-screen">
            <div className="max-w-6xl mx-auto px-4 pt-28 pb-16">
                <div className="bg-white rounded-3xl shadow-md border border-slate-200 px-6 md:px-10 py-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-center text-slate-800 mb-6">
                        ประวัติการจองทริป
                    </h1>

                    {bookings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-sm">
                            <p>ยังไม่มีประวัติการจองทริป</p>
                            <p>ลองกลับไปเลือกแพ็กเกจทริปดำน้ำที่หน้าแรกได้เลยนะครับ</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((b) => (
                                <div
                                    key={b.booking_id}
                                    className="bg-[#F9FDFF] border border-slate-200 rounded-2xl px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                                >
                                    {/* ซ้าย: ข้อมูลทริป */}
                                    <div className="space-y-1 text-sm text-slate-700">
                                        <p className="font-semibold text-slate-900">
                                            {/* ถ้าไม่มี package.name ให้ fallback เป็นข้อความธรรมดา */}
                                            {b.package?.name ?? "แพ็กเกจไม่ระบุ"}
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            <div className="flex items-center gap-1.5">
                                                <CalendarDays className="w-4 h-4" />
                                                <span>วันที่: {formatDateTH(b.trip_date)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                <span>เวลา: {b.time_slot}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Users className="w-4 h-4" />
                                                <span>จำนวนคน: {b.people} คน</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-400">
                                            รหัสการจอง: {b.booking_id} · ยอดชำระรวม: {b.total_price.toString()} บาท
                                        </p>
                                    </div>

                                    {/* ขวา: สถานะ + ปุ่ม View */}
                                    <div className="flex items-end md:items-center gap-3 md:flex-col md:gap-2 md:text-right">
                                        <span
                                            className={
                                                "inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium " +
                                                statusStyle[b.status]
                                            }
                                        >
                                            {statusLabel[b.status]}
                                        </span>

                                        <Link
                                            href={`/booking-history/${b.booking_id}`}
                                            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-medium bg-sky-500 text-white hover:bg-sky-600 transition"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}