export type PackageWithBoat = {
    package_id: number;
    name: string;
    description: string | null;
    price: any;
    package_pic: string | null;

    type: "PRIVATE" | "JOIN";
    category: "FULL_TALU" | "SHORT_TALU" | "FULL_REMOTE" | "JOIN_GROUP";
    status: "active" | "inactive";

    duration_minutes: number | null;
    main_location: string | null;
    max_participants: number | null;
    base_member_count: number;
    extra_price_per_person: any | null;

    boat?: {
        boat_id: number;
        name: string;
        capacity: number;
    } | null;
};