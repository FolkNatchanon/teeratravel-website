// app/api/packages/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const packageId = Number(params.id);

    if (!packageId) {
        return NextResponse.json(
            { error: "Invalid package id" },
            { status: 400 }
        );
    }

    const pkg = await prisma.package.findUnique({
        where: { package_id: packageId },
        select: {
            package_id: true,
            name: true,
            price: true,
            base_member_count: true,
            extra_price_per_person: true,
        },
    });

    if (!pkg) {
        return NextResponse.json(
            { error: "Package not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(pkg);
}