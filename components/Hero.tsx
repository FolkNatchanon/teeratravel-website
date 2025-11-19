"use client";
import Link from "next/link";

export default function Hero() {
    return (
        <section
            className="relative isolate overflow-hidden rounded-2xl mx-auto mt-4 max-w-6xl h-100"
            style={{ boxShadow: "0 10px 30px rgba(0,0,0,.08)" }}
        >
            {/* ภาพพื้นหลัง */}
            <img
                src="/hero.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
            />
            {/* overlay ไล่โทนฟ้า → โปร่ง */}
            {/* <div className="absolute inset-0 bg-gradient-to-b from-blue-100/70 via-white/10 to-white/0" /> */}
            {/* dim เล็กน้อยให้อ่านง่าย */}
            <div className="absolute inset-0 bg-black/10" />

            {/* เนื้อหา */}
            <div className="relative z-10 flex flex-col items-center px-6 py-16 text-center">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-700">
                    ลองค้นหาทริปในฝันของคุณไปกับเราสิ!
                </h1>
                <p className="mt-3 max-w-2xl text-sm sm:text-base text-blue-900/80">
                    สัมผัสประสบการณ์มหัศจรรย์ของการดำน้ำ ด้วยทัวร์นำเที่ยวผู้เชี่ยวชาญและอุปกรณ์ระดับพรีเมียมของเรา
                </p>

                <Link
                    href="#packages"
                    className="mt-35 inline-flex items-center rounded-[10px] bg-blue-600 px-5 py-3 text-white text-sm font-semibold shadow hover:bg-blue-700 active:scale-[.99] transition"
                >
                    ลองทำแบบทดสอบ
                </Link>
            </div>
        </section>
    );
}