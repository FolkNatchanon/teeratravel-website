import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireAdmin } from "@/app/lib/getCurrentUser";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const admin = await requireAdmin();
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookingId = Number(params.id);
    if (!Number.isFinite(bookingId)) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await req.json().catch(() => null);
    const status = body?.status as "pending" | "confirmed" | "cancelled";

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await prisma.booking.update({
        where: { booking_id: bookingId },
        data: { status },
    });

    return NextResponse.json({ ok: true, booking: updated });
}