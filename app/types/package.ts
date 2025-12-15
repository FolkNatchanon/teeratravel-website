// app/types/package.ts

export type PackageCardData = {
    package_id: number;
    name: string;
    description: string | null;
    price: any; // Prisma Decimal หรือ number/string ก็รองรับ
    base_member_count: number | null;
    extra_price_per_person: any;
    category: string;
    main_location: string | null;
    duration_minutes: number | null;
    max_participants: number | null;
    type: "PRIVATE" | "JOIN" | string;
    status: string;
    package_pic: string | null;
};