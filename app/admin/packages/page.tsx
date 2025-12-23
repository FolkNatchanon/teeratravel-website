import Link from "next/link";
import { getBaseUrl } from "@/app/lib/http";
import PackageStatusToggleButton from "./status-toggle-button";

export const dynamic = "force-dynamic";

type PackageRow = {
    package_id: number;
    name: string;
    price: any;
    type: "PRIVATE" | "JOIN";
    time_slot: "MORNING" | "AFTERNOON";
    time: number | null;
    spot_count: number | null;
    status: "active" | "inactive";
    boat: { boat_id: number; name: string; capacity: number; is_active: boolean } | null;
};

export default async function AdminPackagesPage() {
    const res = await fetch(`${getBaseUrl()}/api/admin/packages`, { cache: "no-store" });
    const data = await res.json().catch(() => null);
    const packages: PackageRow[] = data?.packages ?? [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Packages</h1>
                    <p className="text-sm text-slate-500">
                        จัดการแพ็กเกจ (active = แสดงฝั่ง user)
                    </p>
                </div>

                <Link
                    href="/admin/packages/new"
                    className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
                >
                    + สร้าง Package
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-100 text-slate-600">
                        <tr className="border-b border-slate-200">
                            <th className="text-left px-4 py-3 w-[80px]">ID</th>
                            <th className="text-left px-4 py-3">Name</th>
                            <th className="text-left px-4 py-3 w-[140px]">Type</th>
                            <th className="text-left px-4 py-3 w-[170px]">Boat</th>
                            <th className="text-left px-4 py-3 w-[140px]">TimeSlot</th>
                            <th className="text-left px-4 py-3 w-[120px]">Duration</th>
                            <th className="text-left px-4 py-3 w-[110px]">Spots</th>
                            <th className="text-left px-4 py-3 w-[140px]">Status</th>
                            <th className="text-right px-4 py-3 w-[220px]">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {packages.map((p) => (
                            <tr key={p.package_id} className="border-b border-slate-100 text-slate-600">
                                <td className="px-4 py-3">{p.package_id}</td>

                                <td className="px-4 py-3 font-medium text-slate-800">
                                    <div className="flex flex-col">
                                        <span>{p.name}</span>
                                        <span className="text-xs text-slate-500">
                                            ฿{Number(p.price).toLocaleString()}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-4 py-3">{p.type}</td>

                                <td className="px-4 py-3">
                                    {p.boat ? (
                                        <span className="text-slate-700">{p.boat.name}</span>
                                    ) : (
                                        <span className="text-slate-400">—</span>
                                    )}
                                </td>

                                <td className="px-4 py-3">
                                    {p.time_slot === "MORNING" ? "เช้า" : "บ่าย"}
                                </td>

                                <td className="px-4 py-3">
                                    {p.time ? `${p.time} นาที` : <span className="text-slate-400">—</span>}
                                </td>

                                <td className="px-4 py-3">
                                    {p.spot_count ?? <span className="text-slate-400">—</span>}
                                </td>

                                <td className="px-4 py-3">
                                    <span className={"font-semibold " + (p.status === "active" ? "text-green-700" : "text-red-600")}>
                                        {p.status}
                                    </span>
                                </td>

                                <td className="px-4 py-3 text-right space-x-2">
                                    <Link
                                        href={`/admin/packages/${p.package_id}/edit`}
                                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                                    >
                                        Edit
                                    </Link>

                                    <PackageStatusToggleButton packageId={p.package_id} currentStatus={p.status} />
                                </td>
                            </tr>
                        ))}

                        {packages.length === 0 && (
                            <tr>
                                <td colSpan={9} className="px-4 py-10 text-center text-slate-500">
                                    ยังไม่มี Package
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}