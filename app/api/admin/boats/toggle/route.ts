// app/api/admin/boats/toggle/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/auth/currentUser";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        await requireAdmin();

        const body = await req.json().catch(() => null);
        const boat_id = Number(body?.boat_id);
        const is_active = Boolean(body?.is_active);

        if (!Number.isFinite(boat_id)) {
            return NextResponse.json({ message: "INVALID_BOAT_ID" }, { status: 400 });
        }

        const updated = await prisma.boat.update({
            where: { boat_id },
            data: { is_active },
        });

        return NextResponse.json({ data: updated });
    } catch (e: any) {
        if (e?.message === "FORBIDDEN") {
            return NextResponse.json({ message: "FORBIDDEN" }, { status: 403 });
        }
        return NextResponse.json({ message: "ERROR" }, { status: 500 });
    }
}