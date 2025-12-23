import { prisma } from "@/app/lib/prisma";
import type { CreatePackageInput } from "./package.dto";

export async function adminListPackages() {
    return prisma.package.findMany({
        include: { boat: true },
        orderBy: { package_id: "desc" },
    });
}

export async function adminCreatePackage(input: CreatePackageInput) {
    return prisma.package.create({
        data: {
            name: input.name,
            description: input.description ?? null,
            price: input.price as any,

            boat_id: input.boat_id ?? null,

            type: input.type as any,
            time_slot: input.time_slot as any,

            time: input.time ?? null,
            spot_count: input.spot_count ?? null,

            extra_price_per_person: input.extra_price_per_person ?? null,

            status: input.status as any,
        },
    });
}

export async function adminSetPackageStatus(packageId: number, status: "active" | "inactive") {
    return prisma.package.update({
        where: { package_id: packageId },
        data: { status: status as any },
    });
}