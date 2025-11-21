// app/booking/page.tsx
import { prisma } from "../lib/prisma";
import BookingForm from "./BookingForm";
import Link from "next/link";

type SearchParams = {
    package_id?: string;
};

export default async function BookingPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    // ✅ ต้อง await เหมือน params
    const sp = await searchParams;
    const packageId = sp.package_id ? Number(sp.package_id) : null;

    let pkg = null;

    if (packageId && !Number.isNaN(packageId)) {
        pkg = await prisma.package.findUnique({
            where: { package_id: packageId },
        });
    }

    return (
        <main className="min-h-screen">
            <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
                <div className="mb-4">
                    <Link
                        href={pkg ? `/package/${pkg.package_id}` : "/"}
                        className="text-sky-700 text-sm hover:underline"
                    >
                        ← กลับไปหน้าแพ็กเกจ
                    </Link>
                </div>

                <div className="bg-white rounded-3xl shadow-md border border-slate-200 px-6 md:px-10 py-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                        จองทริปดำน้ำ
                    </h1>

                    {pkg ? (
                        <>
                            <p className="text-slate-600 mb-4">
                                แพ็กเกจที่เลือก:{" "}
                                <span className="font-semibold text-slate-900">
                                    {pkg.name}
                                </span>
                            </p>

                            <BookingForm
                                packageId={pkg.package_id}
                                packageName={pkg.name}
                                basePrice={Number(pkg.price)}
                            />
                        </>
                    ) : (
                        <p className="text-slate-500">
                            ไม่พบข้อมูลแพ็กเกจที่ต้องการจอง กรุณากลับไปเลือกแพ็กเกจใหม่อีกครั้ง
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}