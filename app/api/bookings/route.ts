// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth/currentUser";
import { createBooking } from "@/app/lib/services/booking/booking.service";
import {
    clampInt,
    requireISODate,
    requireNumber,
    requireString,
} from "@/app/lib/services/booking/booking.dto";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 401 });
        }

        const body = await req.json().catch(() => null);

        const package_id = requireNumber(body?.package_id, "package_id");
        const trip_date = requireISODate(body?.trip_date, "trip_date");
        const passenger_count = clampInt(requireNumber(body?.passenger_count, "passenger_count"), 1, 50);

        const contact_name = requireString(body?.contact_name, "contact_name");
        const contact_phone = requireString(body?.contact_phone, "contact_phone");
        const note = body?.note ? String(body.note) : null;

        const created = await createBooking(user.user_id, {
            package_id,
            trip_date,
            passenger_count,
            contact_name,
            contact_phone,
            note,
        });

        return NextResponse.json({ ok: true, data: created }, { status: 201 });
    } catch (e: any) {
        const msg = typeof e?.message === "string" ? e.message : "BAD_REQUEST";
        const status =
            msg === "UNAUTHORIZED" ? 401 :
                msg.startsWith("INVALID_") ? 400 :
                    msg === "PACKAGE_NOT_FOUND_OR_INACTIVE" ? 404 :
                        msg === "PASSENGER_COUNT_OUT_OF_RANGE" ? 400 :
                            400;

        return NextResponse.json({ message: msg }, { status });
    }
}