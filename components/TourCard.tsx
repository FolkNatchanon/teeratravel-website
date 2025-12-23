// components/TourCard.tsx
"use client";

type Props = {
    package_id: number;

    image: string;
    title: string;
    price: string | number;
    unit: string; // "/ทริป" หรือ "/คน"
    meta?: string;

    onDetails: (package_id: number) => void; // ✅ callback เพื่อเปิด modal
};

export default function TourCard({
    package_id,
    image,
    title,
    price,
    unit,
    meta,
    onDetails,
}: Props) {
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
                        <div className="text-blue-700 font-extrabold text-sm sm:text-base">
                            {typeof price === "number" ? price.toLocaleString() : price}
                        </div>
                        <div className="text-[10px] sm:text-xs text-blue-600/80">{unit}</div>
                    </div>
                </div>

                {/* ✅ เปิด modal */}
                <button
                    type="button"
                    onClick={() => onDetails(package_id)}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-black text-white py-2 text-xs sm:text-sm font-medium hover:bg-gray-800 transition"
                >
                    ดูรายละเอียด
                </button>
            </div>
        </article>
    );
}