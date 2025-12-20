import { prisma } from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import StatusButtons from "./status-buttons";
import { Booking } from "@/app/types/booking";
import type { Passenger } from "@/app/types/passenger";

type PageProps = {
    params: {
        id: string;
    };
};

export default async function AdminBookingDetailPage({ params }: PageProps) {
    const bookingId = Number(params.id);

    if (isNaN(bookingId)) {
        notFound();
    }

    const booking = await prisma.booking.findUnique({
        where: {
            booking_id: bookingId,
        },
        include: {
            passengers: true,
        },
    });

    if (!booking) {
        notFound();
    }

    // cast เพื่อให้ TypeScript รู้โครงสร้าง
    const bookingData: Booking = {
        booking_id: booking.booking_id,
        status: booking.status,
        booking_date: booking.booking_date,
        passengers: booking.passengers.map((p: Passenger) => ({
            passenger_id: p.passenger_id,
            fname: p.fname,
            lname: p.lname,
            gender: p.gender,
        })),
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">
                    Booking #{bookingData.booking_id}
                </h1>

                <StatusButtons
                    bookingId={bookingData.booking_id}
                    currentStatus={bookingData.status}
                />
            </div>

            {/* Booking Info */}
            <div className="bg-white rounded-xl shadow border border-slate-200 p-6">
                <p className="text-slate-700">
                    <span className="font-medium">Status:</span>{" "}
                    <span className="capitalize">{bookingData.status}</span>
                </p>
                <p className="text-slate-700 mt-1">
                    <span className="font-medium">Booking Date:</span>{" "}
                    {new Date(bookingData.booking_date).toLocaleDateString()}
                </p>
            </div>

            {/* Passengers Table */}
            <div className="bg-white rounded-xl shadow border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-100 text-slate-600">
                            <tr>
                                <th className="text-left px-5 py-3">ชื่อ</th>
                                <th className="text-left px-5 py-3">นามสกุล</th>
                                <th className="text-left px-5 py-3">เพศ</th>
                            </tr>
                        </thead>

                        <tbody>
                            {bookingData.passengers.map((p) => (
                                <tr
                                    key={p.passenger_id}
                                    className="border-b border-slate-100"
                                >
                                    <td className="px-5 py-3">{p.fname}</td>
                                    <td className="px-5 py-3">{p.lname}</td>
                                    <td className="px-5 py-3">{p.gender}</td>
                                </tr>
                            ))}

                            {bookingData.passengers.length === 0 && (
                                <tr>
                                    <td
                                        className="px-5 py-6 text-center text-slate-500"
                                        colSpan={3}
                                    >
                                        ไม่มีผู้โดยสาร
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}