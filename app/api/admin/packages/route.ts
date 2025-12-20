import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/getCurrentUser";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const admin = await requireAdmin();
        if (!admin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // ฟิลด์ตาม schema.prisma ของคุณ
        const {
            name,
            description,
            price,
            package_pic,
            type,
            category,
            status, // "active" | "inactive"
            boat_id,
            main_location,
            spot_count,
            duration_minutes,
            max_participants,
            base_member_count,
            extra_price_per_person,
            includes_left,
            includes_right,
        } = body;

        if (!name || !price || !category) {
            return NextResponse.json(
                { message: "กรุณากรอก Name, Price และ Category" },
                { status: 400 }
            );
        }

        const created = await prisma.package.create({
            data: {
                name: String(name),
                description: description ? String(description) : null,
                price: String(price), // Prisma Decimal รับ string ได้
                package_pic: package_pic ? String(package_pic) : null,

                type: type ?? "PRIVATE",
                category,
                status: status ?? "inactive", // แนะนำ default เป็น inactive ใน admin

                boat_id: boat_id ? Number(boat_id) : null,

                main_location: main_location ? String(main_location) : null,
                spot_count: spot_count !== undefined && spot_count !== null ? Number(spot_count) : null,
                duration_minutes:
                    duration_minutes !== undefined && duration_minutes !== null ? Number(duration_minutes) : null,
                max_participants:
                    max_participants !== undefined && max_participants !== null ? Number(max_participants) : null,

                base_member_count: base_member_count ? Number(base_member_count) : 1,
                extra_price_per_person:
                    extra_price_per_person !== undefined && extra_price_per_person !== null
                        ? String(extra_price_per_person)
                        : null,

                includes_left: includes_left ? String(includes_left) : null,
                includes_right: includes_right ? String(includes_right) : null,
            },
        });

        // ให้หน้า user เห็นผล (กันเคสโดน cache/ISR)
        revalidatePath("/package");

        return NextResponse.json({ ok: true, package: created }, { status: 201 });
    } catch (err) {
        console.error("POST /api/admin/packages error:", err);
        return NextResponse.json({ message: "เกิดข้อผิดพลาดในระบบ" }, { status: 500 });
    }
}