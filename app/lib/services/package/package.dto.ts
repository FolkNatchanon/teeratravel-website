export type PackageType = "PRIVATE" | "JOIN";
export type PackageStatus = "active" | "inactive";
export type TimeSlot = "MORNING" | "AFTERNOON";

export type CreatePackageInput = {
    name: string;
    description?: string | null;
    price: number;

    boat_id?: number | null;

    type: PackageType;
    time_slot: TimeSlot;

    time?: number | null; // นาที
    spot_count?: number | null;

    extra_price_per_person?: number | null;

    status: PackageStatus;
};