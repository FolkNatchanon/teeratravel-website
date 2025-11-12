export default function HomePage() {
  return (
    <section className="flex w-full flex-col bg-white">
      {/* Title */}
      <div id="explore" className="text-center py-20 bg-gradient-to-b from-blue-100 to-white">
        <div className="p-4 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-extrabold mb-4 mt-20 text-blue-700 flex flex-col">ลองค้นหาทริปในฝันของคุณไปกับเราสิ!</h1>
          <p className="text-gray-600 text-[18px] ">สัมผัสประสบการณ์มหัศจรรย์ของการดำน้ำ
            <br />ด้วยทัวร์นำเที่ยวผู้เชี่ยวชาญและอุปกรณ์ระดับพรีเมียมของเรา</p>
          <a href="/tours" className="mt-20 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition w-50">
            ลองทำแบบทดสอบ
          </a>
        </div>
      </div>


    </section>
  )
}