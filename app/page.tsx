// app/page.tsx
import Hero from "@/components/Hero";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 mt-30">
      {/* HERO โปรโมตหลัก */}
      <Hero />

      {/* Section โปรโมตแบรนด์ */}
      <section className="max-w-5xl mx-auto px-4 py-16 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            ดำน้ำตื้นที่เกาะทะลุ กับทีมงานมืออาชีพ
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            TeeraTravel ให้บริการทริปดำน้ำตื้นแบบ Private และ Join Group
            พร้อมบริการอุปกรณ์ดำน้ำ เสื้อชูชีพ อาหารกลางวัน
            และทีมงานไกด์ที่เชี่ยวชาญพื้นที่เกาะทะลุและเกาะรอบ ๆ
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-2">
            <h3 className="font-semibold text-slate-900">
              Private Trip
            </h3>
            <p className="text-sm text-slate-600">
              เหมาะสำหรับครอบครัวหรือกลุ่มเพื่อน
              อยากได้ทริปส่วนตัวเลือกเวลาและแพลนได้เอง
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-2">
            <h3 className="font-semibold text-slate-900">Join Group</h3>
            <p className="text-sm text-slate-600">
              เหมาะสำหรับคนตัวคนเดียวหรือกลุ่มเล็ก ๆ
              อยากแชร์เรือกับนักท่องเที่ยวกลุ่มอื่นในราคาประหยัด
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-2">
            <h3 className="font-semibold text-slate-900">
              ทีมงานประสบการณ์สูง
            </h3>
            <p className="text-sm text-slate-600">
              ไกด์ดำน้ำและลูกเรือที่รู้จักพื้นที่เกาะทะลุเป็นอย่างดี
              เน้นความปลอดภัยและประสบการณ์ที่ดีที่สุดสำหรับลูกค้า
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/package"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-sky-600 text-white font-semibold text-sm md:text-base hover:bg-sky-700 transition"
          >
            ดูแพ็กเกจทั้งหมด
          </Link>
        </div>
      </section>
    </main>
  );
}