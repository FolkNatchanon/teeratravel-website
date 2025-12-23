import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/auth/currentUser";
import { adminListBoats, adminCreateBoat } from "@/app/lib/services/boat/boat.service";

export const runtime = "nodejs";

export async function GET() {
    try {
        await requireAdmin();

        const boats = await adminListBoats();
        return NextResponse.json({ ok: true, boats });
    } catch (err) {
        console.error("GET /api/admin/boats error:", err);
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
}

export async function POST(req: Request) {
    try {
        await requireAdmin();

        const body = await req.json().catch(() => null);
        const name = body?.name?.toString()?.trim();
        const capacity = Number(body?.capacity);
        const is_active = Boolean(body?.is_active);

        if (!name) return NextResponse.json({ message: "กรุณากรอกชื่อเรือ" }, { status: 400 });
        if (!Number.isFinite(capacity) || capacity <= 0)
            return NextResponse.json({ message: "capacity ต้องเป็นตัวเลขมากกว่า 0" }, { status: 400 });

        const boat = await adminCreateBoat({ name, capacity, is_active });
        return NextResponse.json({ ok: true, boat }, { status: 201 });
    } catch (err) {
        console.error("POST /api/admin/boats error:", err);
        return NextResponse.json({ message: "เกิดข้อผิดพลาดในระบบ" }, { status: 500 });
    }
}