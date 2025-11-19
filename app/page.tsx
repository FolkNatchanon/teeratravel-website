// app/page.tsx
import Hero from "@/components/Hero";
import SectionTitle from "@/components/SectionTitle";
import TourCard from "@/components/TourCard";
import { prisma } from "./lib/prisma";
import { PackageWithBoat } from "@/types/package";

// แปลงนาทีเป็น "x ชั่วโมง"
function formatDuration(minutes: number | null): string {
  if (!minutes) return "";
  const hours = minutes / 60;
  return `${hours} ชั่วโมง`;
}

// สร้าง meta text สั้น ๆ สำหรับแสดงใต้ชื่อแพ็กเกจ
function formatMeta(pkg: PackageWithBoat): string {
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

  const people =
    pkg.max_participants ??
    pkg.boat?.capacity ??
    undefined;

  if (people) {
    parts.push(`สูงสุด ${people} คน`);
  }

  return parts.join(" • ");
}

export default async function HomePage() {
  // ดึงแพ็กเกจทั้งหมดที่ active พร้อมข้อมูลเรือ
  const allPackages = (await prisma.package.findMany({
    where: { status: "active" },
    include: { boat: true },
    orderBy: { package_id: "asc" },
  })) as PackageWithBoat[];

  const privatePackages = allPackages.filter((p) => p.type === "PRIVATE");
  const joinPackages = allPackages.filter((p) => p.type === "JOIN");

  return (
    <main className="min-h-screen mt-30">
      {/* HERO */}
      <Hero />

      <div className="h-10 bg-gradient-to-b from-blue-100/60 to-transparent mt-6" />

      {/* PRIVATE TRIPS */}
      <SectionTitle id="packages">แพ็กเกจ Private Trip</SectionTitle>
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {privatePackages.map((pkg) => (
            <TourCard
              key={pkg.package_id}
              image={
                pkg.package_pic
                  ? `/images/${pkg.package_pic}`
                  : "https://images.unsplash.com/photo-1493558103817-58b2924bce98?q=80&w=1200&auto=format&fit=crop"
              }
              title={pkg.name}
              price={`฿${pkg.price.toString()} / ${pkg.base_member_count} Member`}
              unit=""
              meta={formatMeta(pkg)}
              href={`/package/${pkg.package_id}`}
            />
          ))}

          {privatePackages.length === 0 && (
            <p className="text-center text-slate-500 col-span-full py-6">
              ยังไม่มีแพ็กเกจ Private Trip ที่เปิดใช้งาน
            </p>
          )}
        </div>
      </section>

      <div className="h-6" />

      {/* JOIN GROUP */}
      <SectionTitle>แพ็กเกจ Join Group</SectionTitle>
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-w-3xl mx-auto">
          {joinPackages.map((pkg) => (
            <TourCard
              key={pkg.package_id}
              image={
                pkg.package_pic
                  ? `/images/${pkg.package_pic}`
                  : "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop"
              }
              title={pkg.name}
              price={`฿${pkg.price.toString()} / ${pkg.base_member_count} Member`}
              unit=""
              meta={formatMeta(pkg)}
              href={`/package/${pkg.package_id}`}
            />
          ))}

          {joinPackages.length === 0 && (
            <p className="text-center text-slate-500 col-span-full py-6">
              ตอนนี้ยังไม่มีรอบ Join Group ที่เปิดให้จอง
            </p>
          )}
        </div>
      </section>

      <div className="h-12 bg-gradient-to-t from-blue-100/40 to-transparent" />
    </main>
  );
}