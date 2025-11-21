import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HistoryPage() {

    // 📌 1) อ่าน cookie
    const cookieStore = await cookies();
    const rawUser = cookieStore.get("teera_user")?.value;

    if (!rawUser) {
        redirect("/login");
    }

    let user_id: number | null = null;
    try {
        const parsed = JSON.parse(rawUser);
        user_id = parsed.user_id;
    } catch (e) {
        redirect("/login");
    }

    // 📌 2) ดึง booking เฉพาะของ user ที่ login
    const bookings = await prisma.booking.findMany({
        where: { user_id: user_id! },
        include: { package: true },
        orderBy: { trip_date: "desc" },
    });

    return (
        <main className="min-h-screen pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-4">

                <h1 className="text-2xl font-bold text-slate-800 mb-6">
                    ประวัติการจองของคุณ
                </h1>

                {bookings.length === 0 && (
                    <p className="text-slate-500">ยังไม่มีประวัติการจอง</p>
                )}

                <div className="space-y-4">
                    {bookings.map((b) => (
                        <div
                            key={b.booking_id}
                            className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5"
                        >
                            <div className="flex justify-between">
                                <h2 className="text-lg font-semibold text-slate-800">
                                    {b.package?.name ?? "แพ็กเกจไม่พบ"}
                                </h2>

                                {/* แก้ปัญหา status type */}
                                <span
                                    className={`px-3 py-1 text-xs rounded-full 
                                        ${b.status === "confirmed"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : b.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-slate-200 text-slate-600"
                                        }`}
                                >
                                    {b.status}
                                </span>
                            </div>

                            <p className="text-sm text-slate-600 mt-3">
                                เดินทางวันที่ :{" "}
                                <span className="font-medium">
                                    {new Date(b.trip_date).toLocaleDateString("th-TH")}
                                </span>
                            </p>

                            <p className="text-sm text-slate-600">
                                จำนวนคน : {b.people}
                            </p>

                            <p className="text-sm text-slate-600">
                                เวลารอบ : {b.time_slot}
                            </p>

                            <p className="text-sm text-slate-600 mt-2">
                                ราคา :{" "}
                                <span className="font-semibold text-slate-800">
                                    {Number(b.total_price).toLocaleString()} บาท
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}