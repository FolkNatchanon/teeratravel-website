// app/api/packages/[id]/route.ts
import { NextResponse } from "next/server";
import { getActivePackageById } from "@/app/lib/services/package/package.service";

export const runtime = "nodejs";

export async function GET(_: Request, ctx: { params: { id: string } }) {
    const id = Number(ctx.params.id);
    if (!Number.isFinite(id)) {
        return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const pkg = await getActivePackageById(id);
    if (!pkg) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: pkg });
}