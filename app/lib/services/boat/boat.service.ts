import { prisma } from "@/app/lib/prisma";
import type { CreateBoatInput } from "./boat.dto";

export async function adminListBoats() {
    return prisma.boat.findMany({
        orderBy: { boat_id: "desc" },
    });
}

export async function adminCreateBoat(input: CreateBoatInput) {
    return prisma.boat.create({
        data: {
            name: input.name,
            capacity: input.capacity,
            is_active: input.is_active,
        },
    });
}