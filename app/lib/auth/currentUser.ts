// app/lib/auth/currentUser.ts
import { cookies } from "next/headers";
import type { TeeraUserCookie } from "./types";

export async function getCurrentUser(): Promise<TeeraUserCookie | null> {
    const cookieStore = await cookies(); // ✅ Next 15/16 บางรุ่นเป็น async
    const raw = cookieStore.get("teera_user")?.value;

    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw) as TeeraUserCookie;

        if (
            !parsed ||
            typeof parsed.user_id !== "number" ||
            typeof parsed.username !== "string" ||
            (parsed.role !== "A" && parsed.role !== "U")
        ) {
            return null;
        }

        return parsed;
    } catch {
        return null;
    }
}

export async function requireAdmin() {
    const user = await getCurrentUser();
    if (!user || user.role !== "A") {
        throw new Error("FORBIDDEN");
    }
    return user;
}