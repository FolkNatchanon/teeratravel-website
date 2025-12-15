// app/booking/page.tsx
import Link from "next/link";
import { prisma } from "../lib/prisma";
import BookingForm from "./BookingForm";

type SearchParams = {
    packageId?: string; // ใช้ตัวนี้เป็นหลัก (ลิงก์ใหม่)
    package_id?: string; // กันกรณีลิงก์เก่ายังใช้ชื่อแบบนี้
};

export default async function BookingPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    // ✅ Next.js รุ่นใหม่ให้ searchParams มาเป็น Promise
    const sp = await searchParams;

    // รองรับทั้ง packageId และ package_id
    const rawId = sp.packageId ?? sp.package_id ?? null;
    const packageId = rawId ? Number(rawId) : NaN;

    // ถ้าไม่มี id หรือ cast เป็นตัวเลขไม่ได้ → ให้บอกให้กลับไปเลือกแพ็กเกจใหม่
    if (!rawId || Number.isNaN(packageId)) {
        return (
            <main className="min-h-screen bg-slate-50 pt-28 pb-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-3xl shadow-md border border-slate-200 px-6 md:px-10 py-10 text-center space-y-4">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                            ยังไม่ได้เลือกแพ็กเกจ
                        </h1>
                        <p className="text-slate-600">
                            กรุณาเลือกแพ็กเกจก่อนทำการจองทริปดำน้ำ
                        </p>
                        <Link
                            href="/package"
                            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold bg-sky-600 text-white hover:bg-sky-700 transition"
                        >
                            ไปหน้าเลือกแพ็กเกจ
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // ✅ ดึงข้อมูลแพ็กเกจจากฐานข้อมูลด้วย Prisma
    const pkg = await prisma.package.findUnique({
        where: { package_id: packageId },
    });

    // ดึงข้อมูลเรือทั้งหมดที่ active (ให้ user เลือก)
    const boats = await prisma.boat.findMany({
        where: { is_active: true },
        orderBy: { extra_private_price: "asc" },
    });

    return (
        <main className="min-h-screen bg-slate-50 pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-4">
                {/* แถบกลับไปหน้าแพ็กเกจ */}
                <div className="mb-4">
                    <Link
                        href={pkg ? "/package" : "/"}
                        className="text-sky-700 text-sm hover:underline"
                    >
                        ← กลับไปหน้าแพ็กเกจ
                    </Link>
                </div>

                <div className="bg-white rounded-3xl shadow-md border border-slate-200 px-6 md:px-10 py-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                        จองทริปดำน้ำ
                    </h1>
                    <p className="text-slate-500 text-sm mb-6">
                        เลือกวันที่ เวลา จำนวนผู้เดินทาง และเรือที่ต้องการ
                        จากนั้นกดดำเนินการต่อเพื่อกรอกข้อมูลผู้โดยสาร
                    </p>

                    {pkg ? (
                        <BookingForm
                            packageId={pkg.package_id}
                            packageName={pkg.name}
                            packageType={pkg.type} // "PRIVATE" | "JOIN"
                            basePrice={Number(pkg.price)}
                            baseMemberCount={pkg.base_member_count}
                            extraPricePerPerson={
                                pkg.extra_price_per_person
                                    ? Number(pkg.extra_price_per_person)
                                    : null
                            }
                            boats={boats.map((b) => ({
                                boatId: b.boat_id,
                                name: b.name,
                                type: b.type,
                                capacity: b.capacity,
                                extraPrivatePrice: Number(b.extra_private_price),
                            }))}
                        />
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