import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import StatusToggleButton from "./status-toggle-button";
import type { Package } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminPackagesPage() {
    // ระบุ type ชัดเจน
    const packages: Package[] = await prisma.package.findMany({
        orderBy: { package_id: "desc" },
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Packages</h1>
                    <p className="text-sm text-slate-500">
                        สร้าง/เปิด/ปิดแพ็กเกจ (active จะขึ้นหน้า user เป็น TourCard)
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
                            <th className="text-left px-4 py-3">ID</th>
                            <th className="text-left px-4 py-3">Name</th>
                            <th className="text-left px-4 py-3">Type</th>
                            <th className="text-left px-4 py-3">Category</th>
                            <th className="text-left px-4 py-3">Status</th>
                            <th className="text-right px-4 py-3">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {packages.map((p) => (
                            <tr key={p.package_id} className="border-b border-slate-100">
                                <td className="px-4 py-3">{p.package_id}</td>

                                <td className="px-4 py-3 font-medium text-slate-800">
                                    {p.name}
                                </td>

                                <td className="px-4 py-3">{p.type}</td>

                                <td className="px-4 py-3">{p.category}</td>

                                <td className="px-4 py-3">
                                    <span
                                        className={
                                            "font-semibold " +
                                            (p.status === "active"
                                                ? "text-green-700"
                                                : "text-slate-500")
                                        }
                                    >
                                        {p.status}
                                    </span>
                                </td>

                                <td className="px-4 py-3 text-right space-x-2">
                                    {/* Edit */}
                                    <Link
                                        href={`/admin/packages/${p.package_id}/edit`}
                                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
                                    >
                                        Edit
                                    </Link>

                                    {/* Toggle status */}
                                    <StatusToggleButton
                                        packageId={p.package_id}
                                        currentStatus={p.status}
                                    />
                                </td>
                            </tr>
                        ))}

                        {packages.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-10 text-center text-slate-500"
                                >
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