import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/getCurrentUser";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

function getIdFromUrl(req: Request) {
    const pathname = new URL(req.url).pathname; // /api/admin/packages/{id}
    const parts = pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("packages");
    const idStr = idx >= 0 ? parts[idx + 1] : null;
    return idStr ?? null;
}

function toNumberOrNull(v: any) {
    if (v === "" || v === undefined || v === null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

function toStringOrNull(v: any) {
    if (v === "" || v === undefined || v === null) return null;
    return String(v);
}

// GET: เอาข้อมูลเดิมไปเติมในฟอร์ม
export async function GET(req: Request, ctx: { params?: { id?: string } }) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "A") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const idStr = ctx?.params?.id ?? getIdFromUrl(req);
        const packageId = Number(idStr);
        if (!Number.isFinite(packageId)) {
            return NextResponse.json({ message: "Invalid package id" }, { status: 400 });
        }

        const pkg = await prisma.package.findUnique({
            where: { package_id: packageId },
        });

        if (!pkg) {
            return NextResponse.json({ message: "Package not found" }, { status: 404 });
        }

        return NextResponse.json({ ok: true, package: pkg }, { status: 200 });
    } catch (err) {
        console.error("GET /api/admin/packages/[id] error:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

// PATCH: อัปเดต package
export async function PATCH(req: Request, ctx: { params?: { id?: string } }) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "A") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const idStr = ctx?.params?.id ?? getIdFromUrl(req);
        const packageId = Number(idStr);
        if (!Number.isFinite(packageId)) {
            return NextResponse.json({ message: "Invalid package id" }, { status: 400 });
        }

        const body = await req.json().catch(() => ({}));

        // ปรับ field ตาม schema ของนาย (ตัวที่ใช้แน่ ๆ)
        const {
            name,
            description,
            price,        // Decimal -> ส่งเป็น string/number ก็ได้ แต่เราแปลงเป็น string ให้ชัวร์
            package_pic,
            type,         // "PRIVATE" | "JOIN"
            category,     // enum category
            status,       // "active" | "inactive"
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

        // validate เบา ๆ
        if (!name || String(name).trim() === "") {
            return NextResponse.json({ message: "Name is required" }, { status: 400 });
        }
        if (price === undefined || price === null || String(price).trim() === "") {
            return NextResponse.json({ message: "Price is required" }, { status: 400 });
        }

        const updated = await prisma.package.update({
            where: { package_id: packageId },
            data: {
                name: String(name),
                description: toStringOrNull(description),
                price: String(price),
                package_pic: toStringOrNull(package_pic),

                type: type ?? undefined,
                category: category ?? undefined,
                status: status ?? undefined,

                boat_id: toNumberOrNull(boat_id),
                main_location: toStringOrNull(main_location),
                spot_count: toNumberOrNull(spot_count),
                duration_minutes: toNumberOrNull(duration_minutes),
                max_participants: toNumberOrNull(max_participants),
                base_member_count: base_member_count ? Number(base_member_count) : undefined,
                extra_price_per_person:
                    extra_price_per_person === "" || extra_price_per_person === undefined || extra_price_per_person === null
                        ? null
                        : String(extra_price_per_person),

                includes_left: toStringOrNull(includes_left),
                includes_right: toStringOrNull(includes_right),
            },
            select: { package_id: true, status: true, name: true },
        });

        // ให้ทั้ง admin list และ user page เห็นผลทันที
        revalidatePath("/admin/packages");
        revalidatePath("/package");

        return NextResponse.json({ ok: true, updated }, { status: 200 });
    } catch (err) {
        console.error("PATCH /api/admin/packages/[id] error:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}