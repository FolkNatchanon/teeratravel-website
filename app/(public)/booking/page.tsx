// app/(public)/booking/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth/currentUser";
import BookingForm from "./BookingForm.client";
import { getActivePackageById } from "@/app/lib/services/package/package.service";

export const dynamic = "force-dynamic";

type Props = {
    searchParams: { package_id?: string };
};

export default async function BookingPage({ searchParams }: Props) {
    const user = await getCurrentUser();
    if (!user) {
        const pid = searchParams.package_id ? `?next=/booking%3Fpackage_id%3D${encodeURIComponent(searchParams.package_id)}` : "?next=/booking";
        redirect(`/login${pid}`);
    }

    const rawId = searchParams.package_id;
    if (!rawId) {
        // เข้ามาหน้า booking แบบไม่เลือกแพ็กเกจ -> ส่งกลับไปหน้า package
        redirect("/package");
    }

    const packageId = Number(rawId);
    if (!Number.isFinite(packageId)) redirect("/package");

    // ✅ ดึงเฉพาะ active package
    const pkg = await getActivePackageById(packageId);
    if (!pkg) {
        // ไม่เจอหรือ inactive
        redirect("/package");
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-900">ยืนยันการจอง</h1>
                    <p className="text-slate-600 mt-1">
                        คุณกำลังจองแพ็กเกจ: <b>{(pkg as any).name}</b>
                    </p>
                    <p className="text-slate-600">
                        ผู้ใช้งาน: <b>{user.username}</b>
                    </p>
                </div>

                <BookingForm packageData={pkg as any} />
            </div>
        </main>
    );
}