import Link from "next/link";

type Props = {
    image: string;
    title: string;
    price: string;
    unit: string; // "/ทริป" หรือ "/คน"
    meta?: string; // เช่น "4 ชั่วโมง • เช้า/บ่าย"
    href?: string;
};

export default function TourCard({ image, title, price, unit, meta, href = "#" }: Props) {
    return (
        <article className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition">
            <div className="h-40 sm:h-48 w-full overflow-hidden">
                <img src={image} alt={title} className="h-full w-full object-cover" />
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">{title}</h3>
                        {meta && <p className="mt-1 text-xs text-gray-500">{meta}</p>}
                    </div>
                    <div className="text-right">
                        <div className="text-blue-700 font-extrabold text-sm sm:text-base">{price}</div>
                        <div className="text-[10px] sm:text-xs text-blue-600/80">{unit}</div>
                    </div>
                </div>

                <Link
                    href={href}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-black text-white py-2 text-xs sm:text-sm font-medium hover:bg-gray-800 transition"
                >
                    ดูรายละเอียด
                </Link>
            </div>
        </article>
    );
}