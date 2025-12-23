// app/(public)/page.tsx
import Hero from "@/components/Hero";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Hero />

      <section className="max-w-5xl mx-auto px-4 py-16 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            ดำน้ำตื้นที่เกาะทะลุ กับทีมงานมืออาชีพ
          </h2>
          <p className="text-slate-600">
            เลือกแพ็กเกจได้ทั้งแบบ Private Trip และ Join Group
          </p>

          <div className="pt-4">
            <Link
              href="/package"
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-white font-semibold hover:bg-sky-700 transition"
            >
              ดูแพ็กเกจทั้งหมด
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-2">
            <h3 className="font-semibold text-slate-900">Private Trip</h3>
            <p className="text-sm text-slate-600">
              เหมาะสำหรับครอบครัว/กลุ่มเพื่อน ต้องการความเป็นส่วนตัว
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-2">
            <h3 className="font-semibold text-slate-900">Join Group</h3>
            <p className="text-sm text-slate-600">
              เหมาะสำหรับคนตัวคนเดียวหรือกลุ่มเล็ก ๆ แชร์เรือในราคาประหยัด
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-2">
            <h3 className="font-semibold text-slate-900">ทีมงานประสบการณ์สูง</h3>
            <p className="text-sm text-slate-600">
              เน้นความปลอดภัยและประสบการณ์ที่ดี รู้จักพื้นที่เกาะทะลุเป็นอย่างดี
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}