import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/getCurrentUser";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

function getIdFromUrl(req: Request) {
    // /api/admin/packages/{id}/status
    const pathname = new URL(req.url).pathname;
    const parts = pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("packages");
    if (idx === -1) return null;
    const idStr = parts[idx + 1]; // ตำแหน่งหลัง packages
    return idStr ?? null;
}

export async function PATCH(
    req: Request,
    ctx: { params?: { id?: string } }
) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "A") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // ✅ ดึง id จาก params ก่อน ถ้าไม่ได้ค่อย fallback ไปอ่านจาก URL
        const idStr = ctx?.params?.id ?? getIdFromUrl(req);

        const packageId = Number(idStr);
        if (!Number.isFinite(packageId)) {
            return NextResponse.json(
                { message: "Invalid package id", debug: { idStr } },
                { status: 400 }
            );
        }

        const body = await req.json().catch(() => ({}));
        const status = body?.status;

        if (status !== "active" && status !== "inactive") {
            return NextResponse.json(
                { message: "Invalid status (must be active/inactive)" },
                { status: 400 }
            );
        }

        const updated = await prisma.package.update({
            where: { package_id: packageId },
            data: { status },
            select: { package_id: true, status: true },
        });

        revalidatePath("/package");
        revalidatePath("/admin/packages");

        return NextResponse.json({ ok: true, updated }, { status: 200 });
    } catch (err) {
        console.error("PATCH /api/admin/packages/[id]/status error:", err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}