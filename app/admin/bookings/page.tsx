import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

export default async function AdminBookingsPage() {
    const bookings = await prisma.booking.findMany({
        orderBy: { created_at: "desc" },
        take: 50,
        include: { user: true, package: true },
    });

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
                <p className="text-sm text-slate-600 mt-1">จัดการรายการจอง</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="text-slate-600">
                        <tr className="border-b border-slate-200">
                            <th className="text-left px-5 py-3">ID</th>
                            <th className="text-left px-5 py-3">ลูกค้า</th>
                            <th className="text-left px-5 py-3">แพ็กเกจ</th>
                            <th className="text-left px-5 py-3">วัน</th>
                            <th className="text-left px-5 py-3">สถานะ</th>
                            <th className="text-left px-5 py-3">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((b) => (
                            <tr key={b.booking_id} className="border-b border-slate-100">
                                <td className="px-5 py-3">{b.booking_id}</td>
                                <td className="px-5 py-3">{b.user.username}</td>
                                <td className="px-5 py-3">{b.package.name}</td>
                                <td className="px-5 py-3">
                                    {new Date(b.trip_date).toLocaleDateString("th-TH")}
                                </td>
                                <td className="px-5 py-3 capitalize">{b.status}</td>
                                <td className="px-5 py-3">
                                    <Link
                                        href={`/admin/bookings/${b.booking_id}`}
                                        className="inline-flex px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
                                    >
                                        ดูรายละเอียด
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {bookings.length === 0 && (
                            <tr>
                                <td className="px-5 py-6 text-slate-500" colSpan={6}>
                                    ยังไม่มีรายการจอง
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}