import Link from "next/link";
import StatusToggleButton from "./status-toggle-button";

export const dynamic = "force-dynamic";

type BoatRow = {
    boat_id: number;
    name: string;
    capacity: number;
    is_active: boolean;
};

export default async function AdminBoatsPage() {
    // Server Component สามารถ fetch API ภายในได้ (relative URL จะใช้ได้ใน Next)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/admin/boats`, {
        cache: "no-store",
        credentials: "include",
    }).catch(() => null);

    const data = res ? await res.json().catch(() => null) : null;
    const boats: BoatRow[] = data?.boats ?? [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Boats</h1>
                    <p className="text-sm text-slate-500">
                        จัดการข้อมูลเรือ (Active = ใช้งานได้สำหรับเลือกใน Package)
                    </p>
                </div>

                <Link
                    href="/admin/boats/new"
                    className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
                >
                    + สร้าง Boat
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-100 text-slate-600">
                        <tr className="border-b border-slate-200">
                            <th className="text-left px-4 py-3 w-20">ID</th>
                            <th className="text-left px-4 py-3">Name</th>
                            <th className="text-left px-4 py-3 w-35">Capacity</th>
                            <th className="text-left px-4 py-3 w-35">Status</th>
                            <th className="text-right px-4 py-3 w-55">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {boats.map((b) => (
                            <tr key={b.boat_id} className="border-b border-slate-100 text-slate-600">
                                <td className="px-4 py-3">{b.boat_id}</td>

                                <td className="px-4 py-3 font-medium text-slate-800">{b.name}</td>

                                <td className="px-4 py-3">{b.capacity}</td>

                                <td className="px-4 py-3">
                                    <span className={"font-semibold " + (b.is_active ? "text-green-700" : "text-red-600")}>
                                        {b.is_active ? "active" : "inactive"}
                                    </span>
                                </td>

                                <td className="px-4 py-3 text-right space-x-2">
                                    <Link
                                        href={`/admin/boats/${b.boat_id}/edit`}
                                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                                    >
                                        Edit
                                    </Link>

                                    <StatusToggleButton boatId={b.boat_id} currentActive={b.is_active} />
                                </td>
                            </tr>
                        ))}

                        {boats.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                                    ยังไม่มี Boat
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}