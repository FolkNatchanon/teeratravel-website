// app/lib/services/booking/booking.service.ts
import { prisma } from "@/app/lib/prisma";
import type { CreateBookingInput } from "./booking.dto";

export async function createBooking(user_id: number, input: CreateBookingInput) {
    // 1) ตรวจแพ็กเกจต้อง active
    const pkg = await prisma.package.findFirst({
        where: { package_id: input.package_id, status: "active" },
        select: { package_id: true, max_participants: true },
    });

    if (!pkg) {
        throw new Error("PACKAGE_NOT_FOUND_OR_INACTIVE");
    }

    // 2) ตรวจจำนวนคน (เดาแบบสมเหตุสมผล)
    const max = pkg.max_participants ?? 50;
    if (input.passenger_count < 1 || input.passenger_count > max) {
        throw new Error("PASSENGER_COUNT_OUT_OF_RANGE");
    }

    // 3) สร้าง booking
    // ⚠️ ตรงนี้อาจต้อง “ปรับชื่อ field” ให้ตรงกับ Prisma ของคุณ
    const booking = await prisma.booking.create({
        data: {
            user_id,
            package_id: input.package_id,

            // เดาว่าฟิลด์ชื่อ trip_date เป็น DateTime/Date
            trip_date: new Date(input.trip_date),

            passenger_count: input.passenger_count,

            contact_name: input.contact_name,
            contact_phone: input.contact_phone,
            note: input.note ?? null,

            // เดาว่ามี status
            status: "PENDING",
        } as any,
    });

    return booking;
}