// app/(public)/package/page.tsx
import { listActivePackages } from "@/app/lib/services/package/package.service";
import PackageListClient from "./PackageList.client";

export const dynamic = "force-dynamic";

export default async function PackagePage() {
    const packages = await listActivePackages();

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">แพ็กเกจทัวร์</h1>
                    <p className="text-slate-600 mt-1">แสดงเฉพาะแพ็กเกจที่เปิดขาย (active)</p>
                </div>

                <PackageListClient packages={packages as any[]} />
            </div>
        </main>
    );
}