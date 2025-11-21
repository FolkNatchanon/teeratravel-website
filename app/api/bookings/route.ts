import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const packageId = Number(body.packageId);
        const people = Number(body.people);
        const tripDateStr = body.tripDate as string | undefined;
        const timeSlot = body.timeSlot as string | undefined;

        if (!packageId || !people || !tripDateStr || !timeSlot) {
            return NextResponse.json(
                { message: "ข้อมูลไม่ครบ กรุณากรอกวันที่ ช่วงเวลา และจำนวนคน" },
                { status: 400 }
            );
        }

        // ✅ อ่าน user จาก cookie
        const cookieStore = await cookies();
        const rawUser = cookieStore.get("teera_user")?.value;

        if (!rawUser) {
            return NextResponse.json(
                { message: "กรุณาเข้าสู่ระบบก่อนทำการจอง" },
                { status: 401 }
            );
        }

        let user_id: number | null = null;
        try {
            const parsed = JSON.parse(rawUser);
            user_id = parsed.user_id;
        } catch (e) {
            console.error("Parse cookie error:", e);
        }

        if (!user_id) {
            return NextResponse.json(
                { message: "ไม่พบข้อมูลผู้ใช้ในระบบ กรุณาเข้าสู่ระบบใหม่อีกครั้ง" },
                { status: 401 }
            );
        }

        const pkg = await prisma.package.findUnique({
            where: { package_id: packageId },
        });

        if (!pkg) {
            return NextResponse.json(
                { message: "ไม่พบแพ็กเกจที่ต้องการจอง" },
                { status: 404 }
            );
        }

        const basePrice =
            typeof (pkg as any).price === "number"
                ? (pkg as any).price
                : Number((pkg as any).price);

        const totalPrice = basePrice * people;
        const tripDate = new Date(tripDateStr);

        const booking = await prisma.booking.create({
            data: {
                user_id,            // ⬅️ ใช้ของจริงจาก cookie
                package_id: packageId,
                trip_date: tripDate,
                time_slot: timeSlot,
                people,
                total_price: totalPrice,
            },
        });

        return NextResponse.json({ booking }, { status: 201 });
    } catch (error: any) {
        console.error("Create booking error:", error);
        return NextResponse.json(
            { message: error?.message ?? "เกิดข้อผิดพลาดในระบบ" },
            { status: 500 }
        );
    }
}