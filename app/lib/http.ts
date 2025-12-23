// app/lib/http.ts
import { headers } from "next/headers";

/**
 * คืนค่า base URL แบบ absolute สำหรับ server-side fetch
 * รองรับ local/dev + production
 */
export async function getBaseUrl() {
    const h = await headers(); // ✅ ต้อง await
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto = h.get("x-forwarded-proto") ?? "http";

    if (!host) {
        // fallback กันพัง (ควรไม่เกิดใน runtime ปกติ)
        return "http://localhost:3000";
    }

    return `${proto}://${host}`;
}