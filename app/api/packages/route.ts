import { NextResponse } from "next/server";
import { listActivePackages } from "@/app/lib/services/package/package.service";

export async function GET() {
    const data = await listActivePackages();
    return NextResponse.json({ data });
}