// app/history/page.tsx
import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HistoryPage() {
    // 1) อ่าน user จาก cookie
    const cookieStore = await cookies();
    const rawUser = cookieStore.get("teera_user")?.value;

    if (!rawUser) {
        redirect("/login");
    }

    let user_id: number | null = null;
    try {
        const parsed = JSON.parse(rawUser!);
        user_id = parsed.user_id;
    } catch {
        redirect("/login");
    }

    if (!user_id) {
        redirect("/login");
    }

    // 2) ดึง booking ของ user นี้
    const bookings = await prisma.booking.findMany({
        where: { user_id },
        include: { package: true },
        orderBy: { trip_date: "desc" },
    });

    return (
        <main className="min-h-screen pt-28 pb-16 bg-slate-50">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                    ประวัติการจองของคุณ
                </h1>

                {bookings.length === 0 ? (
                    <p className="text-slate-600">
                        ยังไม่มีประวัติการจอง ลองเริ่มจองทริปดำน้ำได้ที่หน้าแพ็กเกจ
                    </p>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((b) => (
                            <div
                                key={b.booking_id}
                                className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col gap-1"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            หมายเลขการจอง #{b.booking_id}
                                        </p>
                                        <p className="font-semibold text-slate-900">
                                            {b.package?.name ?? "ไม่พบชื่อแพ็กเกจ"}
                                        </p>
                                    </div>
                                    <span className="text-xs px-3 py-1 rounded-full bg-sky-50 text-sky-700 font-medium">
                                        {b.status}
                                    </span>
                                </div>

                                <p className="text-sm text-slate-600">
                                    วันที่เดินทาง:{" "}
                                    <span className="font-medium text-slate-800">
                                        {new Date(b.trip_date).toLocaleDateString("th-TH")}
                                    </span>{" "}
                                    เวลา{" "}
                                    <span className="font-medium text-slate-800">
                                        {b.time_slot}
                                    </span>
                                </p>

                                <p className="text-sm text-slate-600">
                                    จำนวนผู้เดินทาง:{" "}
                                    <span className="font-medium text-slate-800">
                                        {b.people} คน
                                    </span>
                                </p>

                                <p className="text-sm text-slate-600">
                                    ราคารวมทั้งหมด:{" "}
                                    <span className="font-semibold text-slate-800">
                                        {Number(b.total_price).toLocaleString()} บาท
                                    </span>
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}