// app/package/page.tsx
import SectionTitle from "../../components/SectionTitle";
import TourCard from "../../components/TourCard";
import { getAllActivePackages } from "../lib/services/packageService";
import type { PackageCardData } from "../types/package";
export const dynamic = "force-dynamic";

// แปลงนาทีเป็น "x ชั่วโมง"
function formatDuration(minutes: number | null): string {
    if (!minutes) return "";
    const hours = minutes / 60;
    return `${hours} ชั่วโมง`;
}

// สร้าง meta text สั้น ๆ สำหรับแสดงใต้ชื่อแพ็กเกจ
function formatMeta(pkg: PackageCardData): string {
    const durationText = formatDuration(pkg.duration_minutes);
    const parts: string[] = [];

    if (durationText) parts.push(durationText);

    switch (pkg.category) {
        case "FULL_TALU":
            parts.push("ดำน้ำ 3 จุด • เกาะทะลุ");
            break;
        case "SHORT_TALU":
            parts.push("ดำน้ำ 2 จุด • เกาะทะลุ");
            break;
        case "FULL_REMOTE":
            parts.push("เกาะล้านเป็ดล้านไก่");
            break;
        case "JOIN_GROUP":
            parts.push("รอบจอยกรุ๊ป");
            break;
    }

    if (pkg.main_location && !parts.some((p) => p.includes(pkg.main_location!))) {
        parts.push(pkg.main_location);
    }

    const people = pkg.max_participants ?? pkg.base_member_count ?? null;
    if (people) {
        parts.push(`สูงสุด ${people} คน`);
    }

    return parts.join(" • ");
}

export default async function PackageListPage() {
    const allPackages = (await getAllActivePackages()) as PackageCardData[];

    const privatePackages = allPackages.filter(
        (p: PackageCardData) => p.type === "PRIVATE"
    );
    const joinPackages = allPackages.filter(
        (p: PackageCardData) => p.type === "JOIN"
    );

    return (
        <main className="min-h-screen bg-slate-50 pt-28 pb-16">
            <div className="max-w-6xl mx-auto px-4 space-y-10">
                {/* หัวข้อใหญ่ของหน้า */}
                <header className="text-center space-y-3">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                        เลือกแพ็กเกจดำน้ำกับ TeeraTravel
                    </h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        เลือกได้ทั้งทริป Private เหมาลำสำหรับกลุ่มของคุณเอง
                        หรือแพ็กเกจ Join Group สำหรับคนที่อยากแชร์เรือกับนักท่องเที่ยวท่านอื่น
                    </p>
                </header>

                {/* PRIVATE TRIP */}
                <section>
                    <SectionTitle>แพ็กเกจ Private Trip</SectionTitle>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        {privatePackages.map((pkg: PackageCardData) => (
                            <TourCard
                                key={pkg.package_id}
                                image={
                                    pkg.package_pic
                                        ? `/images/${pkg.package_pic}`
                                        : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"
                                }
                                title={pkg.name}
                                price={`฿${pkg.price.toString()} / ${pkg.base_member_count ?? 10
                                    } Member`}
                                unit=""
                                meta={formatMeta(pkg)}
                                // 🔥 เปลี่ยนให้ลิงก์ไปหน้า booking พร้อมส่ง packageId
                                href={`/booking?packageId=${pkg.package_id}`}
                            />
                        ))}

                        {privatePackages.length === 0 && (
                            <p className="text-center text-slate-500 col-span-full py-6">
                                ยังไม่มีแพ็กเกจ Private Trip ที่เปิดใช้งาน
                            </p>
                        )}
                    </div>
                </section>

                {/* JOIN GROUP */}
                <section>
                    <SectionTitle>แพ็กเกจ Join Group</SectionTitle>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        {joinPackages.map((pkg: PackageCardData) => (
                            <TourCard
                                key={pkg.package_id}
                                image={
                                    pkg.package_pic
                                        ? `/images/${pkg.package_pic}`
                                        : "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop"
                                }
                                title={pkg.name}
                                price={`฿${pkg.price.toString()} / ${pkg.base_member_count ?? 10
                                    } Member`}
                                unit=""
                                meta={formatMeta(pkg)}
                                // 🔥 ตรงนี้ก็เหมือนกัน
                                href={`/booking?packageId=${pkg.package_id}`}
                            />
                        ))}

                        {joinPackages.length === 0 && (
                            <p className="text-center text-slate-500 col-span-full py-6">
                                ตอนนี้ยังไม่มีรอบ Join Group ที่เปิดให้จอง
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}