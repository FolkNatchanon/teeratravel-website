// app/lib/services/packageService.ts
import { prisma } from "../prisma";

/**
 * ดึงแพ็กเกจทั้งหมดที่ active พร้อมข้อมูลเรือ
 */
export async function getAllActivePackages() {
    return prisma.package.findMany({
        where: { status: "active" }, // <-- ใช้ string แทน PackageStatus.active
        include: { boat: true },
        orderBy: { package_id: "asc" },
    });
}

/**
 * ดึงเฉพาะแพ็กเกจ Private Trip
 */
export async function getPrivatePackages() {
    return prisma.package.findMany({
        where: {
            type: "PRIVATE",          // <-- แทน PackageType.PRIVATE
            status: "active",
        },
        include: { boat: true },
        orderBy: { package_id: "asc" },
    });
}

/**
 * ดึงเฉพาะแพ็กเกจ Join Group (ใช้สำหรับหน้า Join)
 */
export async function getJoinPackages() {
    return prisma.package.findMany({
        where: {
            type: "JOIN",             // <-- แทน PackageType.JOIN
            status: "active",
        },
        include: { boat: true },
        orderBy: { package_id: "asc" },
    });
}

/**
 * ดึงแพ็กเกจตาม ID (ใช้ในหน้า /package/[id])
 */
export async function getPackageById(id: number) {
    return prisma.package.findUnique({
        where: { package_id: id },
        include: { boat: true },
    });
}