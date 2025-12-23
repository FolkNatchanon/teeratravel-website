// app/api/admin/packages/[id]/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/lib/auth/currentUser";
import {
    adminGetPackageById,
    adminUpdatePackage,
} from "@/app/lib/services/package/package.service";
import { toNumberOrNull, toStringOrNull } from "@/app/lib/services/package/package.dto";

export const runtime = "nodejs";

export async function GET(_: Request, ctx: { params: { id: string } }) {
    try {
        await requireAdmin();
        const id = Number(ctx.params.id);
        if (!Number.isFinite(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

        const pkg = await adminGetPackageById(id);
        if (!pkg) return NextResponse.json({ message: "Not found" }, { status: 404 });

        return NextResponse.json({ data: pkg });
    } catch {
        return NextResponse.json({ message: "FORBIDDEN" }, { status: 403 });
    }
}

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
    try {
        await requireAdmin();

        const id = Number(ctx.params.id);
        if (!Number.isFinite(id)) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

        const body = await req.json();

        const updated = await adminUpdatePackage(id, {
            ...(body?.name !== undefined ? { name: String(body.name) } : {}),
            ...(body?.description !== undefined ? { description: toStringOrNull(body.description) } : {}),
            ...(body?.price !== undefined ? { price: String(body.price) } : {}),
            ...(body?.package_pic !== undefined ? { package_pic: toStringOrNull(body.package_pic) } : {}),

            ...(body?.type !== undefined ? { type: body.type } : {}),
            ...(body?.category !== undefined ? { category: body.category } : {}),
            ...(body?.status !== undefined ? { status: body.status } : {}),

            ...(body?.boat_id !== undefined ? { boat_id: toNumberOrNull(body.boat_id) } : {}),

            ...(body?.main_location !== undefined ? { main_location: toStringOrNull(body.main_location) } : {}),
            ...(body?.spot_count !== undefined ? { spot_count: toNumberOrNull(body.spot_count) } : {}),
            ...(body?.duration_minutes !== undefined ? { duration_minutes: toNumberOrNull(body.duration_minutes) } : {}),
            ...(body?.max_participants !== undefined ? { max_participants: toNumberOrNull(body.max_participants) } : {}),

            ...(body?.base_member_count !== undefined ? { base_member_count: Number(body.base_member_count) } : {}),
            ...(body?.extra_price_per_person !== undefined
                ? { extra_price_per_person: toStringOrNull(body.extra_price_per_person) }
                : {}),

            ...(body?.includes_left !== undefined ? { includes_left: toStringOrNull(body.includes_left) } : {}),
            ...(body?.includes_right !== undefined ? { includes_right: toStringOrNull(body.includes_right) } : {}),
        });

        return NextResponse.json({ data: updated });
    } catch (e: any) {
        const msg = typeof e?.message === "string" ? e.message : "BAD_REQUEST";
        return NextResponse.json({ message: msg }, { status: msg === "FORBIDDEN" ? 403 : 400 });
    }
}