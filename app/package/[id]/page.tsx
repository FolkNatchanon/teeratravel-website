// app/package/[id]/page.tsx
import { prisma } from "../../lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function PackageDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    // ⬅️ Next.js รุ่นใหม่ส่ง params เป็น Promise ต้อง await ก่อน
    const { id } = await params;

    const packageId = Number(id);

    // เช็คว่า id เป็นตัวเลขจริงไหม
    if (Number.isNaN(packageId)) {
        return (
            <main className="min-h-screen pt-40 flex justify-center items-center">
                <div>❌ Invalid package ID</div>
            </main>
        );
    }

    // ดึงข้อมูลแพ็กเกจจากฐานข้อมูลด้วย Prisma
    const pkg = await prisma.package.findUnique({
        where: { package_id: packageId },
    });

    // ถ้าไม่เจอแพ็กเกจ
    if (!pkg) {
        return (
            <main className="min-h-screen pt-40 flex justify-center items-center">
                <div>❌ ไม่พบข้อมูลแพ็กเกจ id = {packageId}</div>
            </main>
        );
    }

    // ถ้าเจอแพ็กเกจแล้ว แสดงผลหน้า detail
    return (
        <main className="min-h-screen bg-[#D9F7FF]">
            <div className="max-w-5xl mx-auto pt-28 pb-16 px-4">
                {/* ปุ่มกลับหน้าแรก */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sky-700 hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" />
                    กลับหน้าหลัก
                </Link>

                {/* กล่องเนื้อหา */}
                <div className="bg-white mt-4 rounded-3xl shadow-lg p-6 md:p-10 border border-slate-200 space-y-6">
                    {/* รูปแพ็กเกจ */}
                    <div className="relative w-full h-72 rounded-xl overflow-hidden shadow">
                        <Image
                            src={`/images/${pkg.package_pic ?? "default.jpg"}`}
                            alt={pkg.name}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* ชื่อ + ราคา */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <h1 className="text-3xl font-bold text-slate-800">{pkg.name}</h1>

                        <p className="text-xl font-semibold text-sky-600">
                            ราคาเริ่มต้น {pkg.price.toString()} บาท/คน
                        </p>
                    </div>

                    {/* รายละเอียดแพ็กเกจ */}
                    <p className="text-slate-600 leading-relaxed">
                        {pkg.description ?? "ไม่มีรายละเอียดสำหรับแพ็กเกจนี้"}
                    </p>

                    {/* ปุ่มจอง */}
                    <div className="pt-2">
                        <Link
                            href={`/booking?package_id=${pkg.package_id}`}
                            className="inline-flex justify-center items-center bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-full text-lg font-medium w-full md:w-auto transition"
                        >
                            จองตอนนี้
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
