// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/app/lib/prisma";
import { calculateTotalPrice } from "@/app/lib/bookingPrice";

// ----- Types ของข้อมูลที่ frontend ส่งมา -----

type PassengerInput = {
    fname: string;
    lname: string;
    age: number | string;
    gender: "M" | "F" | "Other";
};

type BookingRequestBody = {
    packageId: number;
    tripDate: string; // "2025-11-25" หรือ ISO string
    timeSlot: string;
    people: number;

    // PRIVATE
    boatId?: number | null;

    // JOIN
    joinTripId?: number | null;

    passengers: PassengerInput[];
};

// -------------------------------------------------
// POST /api/bookings
// -------------------------------------------------
export async function POST(request: Request) {
    try {
        const body = (await request.json()) as BookingRequestBody;

        const {
            packageId,
            tripDate,
            timeSlot,
            people,
            boatId,
            joinTripId,
            passengers,
        } = body;

        // ---------------------------------------------
        // 1) ดึง user จาก cookie
        //    - แบบใหม่: teera_user (JSON)
        //    - แบบเก่า: user_id / userId / uid
        // ---------------------------------------------
        const cookieStore = await cookies();

        let userId: number | null = null;

        // 1.1 ลองอ่านจาก cookie "teera_user" (แบบใหม่)
        const rawUser = cookieStore.get("teera_user")?.value;
        if (rawUser) {
            try {
                const parsed = JSON.parse(rawUser);
                if (parsed?.user_id) {
                    const n = Number(parsed.user_id);
                    if (!Number.isNaN(n)) {
                        userId = n;
                    }
                }
            } catch (e) {
                console.error("[/api/bookings] parse teera_user failed:", e);
            }
        }

        // 1.2 ถ้าไม่เจอ ให้ลอง key แบบเก่า (user_id, userId, uid)
        if (!userId) {
            const possibleKeys = ["user_id", "userId", "uid"];

            for (const key of possibleKeys) {
                const c = cookieStore.get(key);
                if (c) {
                    const n = Number(c.value);
                    if (!Number.isNaN(n)) {
                        userId = n;
                        break;
                    }
                }
            }
        }

        // Debug: แสดง cookie ทั้งหมดใน server log
        console.log("[/api/bookings] cookies:", cookieStore.getAll());
        console.log("[/api/bookings] resolved userId:", userId);

        if (!userId) {
            return NextResponse.json(
                { message: "กรุณาเข้าสู่ระบบก่อนทำการจอง" },
                { status: 401 }
            );
        }

        // ---------------------------------------------
        // 2) ตรวจข้อมูลพื้นฐานจาก body
        // ---------------------------------------------
        if (!packageId || !tripDate || !timeSlot || !people) {
            return NextResponse.json(
                { message: "ข้อมูลสำหรับการจองไม่ครบถ้วน" },
                { status: 400 }
            );
        }

        if (!Array.isArray(passengers) || passengers.length === 0) {
            return NextResponse.json(
                { message: "กรุณากรอกข้อมูลผู้โดยสารอย่างน้อย 1 คน" },
                { status: 400 }
            );
        }

        // ---------------------------------------------
        // 3) ดึงข้อมูลแพ็กเกจ
        // ---------------------------------------------
        const pkg = await prisma.package.findUnique({
            where: { package_id: Number(packageId) },
        });

        if (!pkg) {
            return NextResponse.json(
                { message: "ไม่พบแพ็กเกจที่ต้องการจอง" },
                { status: 404 }
            );
        }

        const isJoinPackage = pkg.type === "JOIN";

        let joinTrip:
            | Awaited<ReturnType<typeof prisma.joinTrip.findUnique>>
            | null = null;

        let boat:
            | Awaited<ReturnType<typeof prisma.boat.findUnique>>
            | null = null;

        // ---------------------------------------------
        // 4) กรณี JOIN PACKAGE → ต้องมี joinTripId
        // ---------------------------------------------
        if (isJoinPackage) {
            if (!joinTripId) {
                return NextResponse.json(
                    { message: "กรุณาเลือกรอบ Join Trip ก่อนทำการจอง" },
                    { status: 400 }
                );
            }

            joinTrip = await prisma.joinTrip.findUnique({
                where: { join_trip_id: Number(joinTripId) },
            });

            if (!joinTrip || joinTrip.package_id !== pkg.package_id) {
                return NextResponse.json(
                    { message: "ไม่พบรอบ Join Trip ที่เลือก" },
                    { status: 404 }
                );
            }

            if (people > joinTrip.max_seats) {
                return NextResponse.json(
                    {
                        message: `จำนวนผู้เดินทาง (${people} คน) เกินจำนวนที่รองรับของรอบนี้ (สูงสุด ${joinTrip.max_seats} คน)`,
                    },
                    { status: 400 }
                );
            }
        } else {
            // -------------------------------------------
            // 5) กรณี PRIVATE PACKAGE → ต้องมี boatId
            // -------------------------------------------
            if (!boatId) {
                return NextResponse.json(
                    { message: "กรุณาเลือกเรือสำหรับทริป Private" },
                    { status: 400 }
                );
            }

            boat = await prisma.boat.findUnique({
                where: { boat_id: Number(boatId) },
            });

            if (!boat) {
                return NextResponse.json(
                    { message: "ไม่พบเรือที่เลือก" },
                    { status: 404 }
                );
            }

            if (!boat.is_active) {
                return NextResponse.json(
                    { message: "เรือลำนี้ยังไม่เปิดให้ใช้งาน กรุณาเลือกลำอื่น" },
                    { status: 400 }
                );
            }

            if (people > boat.capacity) {
                return NextResponse.json(
                    {
                        message: `จำนวนผู้เดินทาง (${people} คน) เกินความจุของเรือ (สูงสุด ${boat.capacity} คน)`,
                    },
                    { status: 400 }
                );
            }
        }

        // ---------------------------------------------
        // 6) คำนวณราคา
        // ---------------------------------------------
        let totalPrice = 0;

        if (isJoinPackage) {
            if (!joinTrip) {
                return NextResponse.json(
                    { message: "ไม่พบข้อมูลรอบ Join Trip" },
                    { status: 500 }
                );
            }

            totalPrice =
                Number(joinTrip.price_per_person) * Number(people || 0);
        } else {
            totalPrice = calculateTotalPrice(
                {
                    price: pkg.price,
                    base_member_count: pkg.base_member_count,
                    extra_price_per_person: pkg.extra_price_per_person,
                },
                Number(people || 0)
            );

            const boatExtra = boat ? Number(boat.extra_private_price ?? 0) : 0;
            totalPrice += boatExtra;
        }

        // ---------------------------------------------
        // 7) สร้าง Booking + Passenger
        // ---------------------------------------------
        const booking = await prisma.booking.create({
            data: {
                user_id: userId,
                package_id: pkg.package_id,
                join_trip_id: isJoinPackage
                    ? joinTrip!.join_trip_id
                    : null,
                boat_id: isJoinPackage
                    ? null
                    : boat
                        ? boat.boat_id
                        : null,
                trip_date: new Date(tripDate),
                time_slot: timeSlot,
                people: Number(people),
                total_price: totalPrice,
                status: "pending",
                passengers: {
                    create: passengers.map((p) => ({
                        fname: p.fname,
                        lname: p.lname,
                        age: Number(p.age),
                        gender: p.gender,
                    })),
                },
            },
            include: {
                package: true,
                boat: true,
                joinTrip: true,
                passengers: true,
            },
        });

        return NextResponse.json(
            {
                message: "สร้างการจองสำเร็จ",
                booking,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("[POST /api/bookings] error:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในการสร้างการจอง" },
            { status: 500 }
        );
    }
}