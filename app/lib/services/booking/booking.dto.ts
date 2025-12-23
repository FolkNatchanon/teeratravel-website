// app/lib/services/booking/booking.dto.ts

export type CreateBookingInput = {
    package_id: number;
    trip_date: string; // ISO date string เช่น "2025-12-25"
    passenger_count: number;

    contact_name: string;
    contact_phone: string;
    note?: string | null;
};

export function requireString(v: any, field: string) {
    const s = String(v ?? "").trim();
    if (!s) throw new Error(`INVALID_${field.toUpperCase()}`);
    return s;
}

export function requireNumber(v: any, field: string) {
    const n = Number(v);
    if (!Number.isFinite(n)) throw new Error(`INVALID_${field.toUpperCase()}`);
    return n;
}

export function clampInt(n: number, min: number, max: number) {
    const x = Math.floor(n);
    return Math.min(max, Math.max(min, x));
}

export function requireISODate(v: any, field: string) {
    const s = requireString(v, field);
    // รูปแบบ YYYY-MM-DD แบบง่าย ๆ
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new Error(`INVALID_${field.toUpperCase()}`);
    return s;
}