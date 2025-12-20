import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/getCurrentUser";

export default async function AdminDashboardPage() {
    const admin = await requireAdmin();
    if (!admin) return null; // middleware กันแล้ว แต่เผื่อไว้

    const [total, pending, confirmed, cancelled] = await Promise.all([
        prisma.booking.count(),
        prisma.booking.count({ where: { status: "pending" } }),
        prisma.booking.count({ where: { status: "confirmed" } }),
        prisma.booking.count({ where: { status: "cancelled" } }),
    ]);

    const recent = await prisma.booking.findMany({
        orderBy: { created_at: "desc" },
        take: 8,
        include: { user: true, package: true },
    });

    const cards = [
        { label: "Bookings ทั้งหมด", value: total },
        { label: "Pending", value: pending },
        { label: "Confirmed", value: confirmed },
        { label: "Cancelled", value: cancelled },
    ];

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-600 mt-1 text-sm">
                    สวัสดี {admin.username} (Admin)
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((c) => (
                    <div key={c.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                        <p className="text-sm text-slate-600">{c.label}</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">{c.value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="p-5 border-b border-slate-200">
                    <h2 className="font-semibold text-slate-900">รายการจองล่าสุด</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="text-slate-600">
                            <tr className="border-b border-slate-200">
                                <th className="text-left px-5 py-3">ID</th>
                                <th className="text-left px-5 py-3">ลูกค้า</th>
                                <th className="text-left px-5 py-3">แพ็กเกจ</th>
                                <th className="text-left px-5 py-3">วัน</th>
                                <th className="text-left px-5 py-3">คน</th>
                                <th className="text-left px-5 py-3">สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recent.map((b) => (
                                <tr key={b.booking_id} className="border-b border-slate-100">
                                    <td className="px-5 py-3">{b.booking_id}</td>
                                    <td className="px-5 py-3">{b.user.username}</td>
                                    <td className="px-5 py-3">{b.package.name}</td>
                                    <td className="px-5 py-3">
                                        {new Date(b.trip_date).toLocaleDateString("th-TH")}
                                    </td>
                                    <td className="px-5 py-3">{b.people}</td>
                                    <td className="px-5 py-3 capitalize">{b.status}</td>
                                </tr>
                            ))}
                            {recent.length === 0 && (
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
        </div>
    );
}