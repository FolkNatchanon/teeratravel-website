import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/auth/currentUser";
import { adminSetPackageStatus } from "@/app/lib/services/package/package.service";

export const runtime = "nodejs";

export async function POST(req: Request, ctx: { params: { id: string } }) {
    try {
        await requireAdmin();

        const id = Number(ctx.params.id);
        if (!Number.isFinite(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

        const body = await req.json().catch(() => null);
        const status = body?.status === "active" ? "active" : "inactive";

        const updated = await adminSetPackageStatus(id, status);
        return NextResponse.json({ ok: true, package: updated });
    } catch (err) {
        console.error("POST /api/admin/packages/[id]/status error:", err);
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
}