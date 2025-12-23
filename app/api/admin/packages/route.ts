import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/auth/currentUser";
import { adminCreatePackage, adminListPackages } from "@/app/lib/services/package/package.service";

export const runtime = "nodejs";

export async function GET() {
    try {
        await requireAdmin();
        const packages = await adminListPackages();
        return NextResponse.json({ ok: true, packages });
    } catch (err) {
        console.error("GET /api/admin/packages error:", err);
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
}

export async function POST(req: Request) {
    try {
        await requireAdmin();

        const body = await req.json().catch(() => null);

        const name = body?.name?.toString()?.trim();
        const description = body?.description?.toString()?.trim() || null;

        const price = Number(body?.price);
        const boat_id = body?.boat_id ? Number(body.boat_id) : null;

        const type = body?.type === "JOIN" ? "JOIN" : "PRIVATE";
        const time_slot = body?.time_slot === "AFTERNOON" ? "AFTERNOON" : "MORNING";

        const time = body?.time === "" || body?.time == null ? null : Number(body?.time);
        const spot_count =
            body?.spot_count === "" || body?.spot_count == null ? null : Number(body?.spot_count);

        const extra_price_per_person =
            body?.extra_price_per_person === "" || body?.extra_price_per_person == null
                ? null
                : Number(body?.extra_price_per_person);

        const status = body?.status === "active" ? "active" : "inactive";

        if (!name) return NextResponse.json({ message: "กรุณากรอกชื่อแพ็กเกจ" }, { status: 400 });
        if (!Number.isFinite(price) || price <= 0)
            return NextResponse.json({ message: "price ต้องเป็นตัวเลขมากกว่า 0" }, { status: 400 });

        if (time !== null && (!Number.isFinite(time) || time <= 0))
            return NextResponse.json({ message: "time ต้องเป็นตัวเลขมากกว่า 0" }, { status: 400 });

        if (spot_count !== null && (!Number.isFinite(spot_count) || spot_count < 0))
            return NextResponse.json({ message: "spot_count ไม่ถูกต้อง" }, { status: 400 });

        if (
            extra_price_per_person !== null &&
            (!Number.isFinite(extra_price_per_person) || extra_price_per_person < 0)
        )
            return NextResponse.json({ message: "extra_price_per_person ไม่ถูกต้อง" }, { status: 400 });

        const created = await adminCreatePackage({
            name,
            description,
            price,
            boat_id,
            type,
            time_slot,
            time,
            spot_count,
            extra_price_per_person,
            status,
        });

        return NextResponse.json({ ok: true, package: created }, { status: 201 });
    } catch (err) {
        console.error("POST /api/admin/packages error:", err);
        return NextResponse.json({ message: "เกิดข้อผิดพลาดในระบบ" }, { status: 500 });
    }
}