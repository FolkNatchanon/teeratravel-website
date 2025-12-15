// app/lib/getCurrentUser.ts
import { cookies } from "next/headers";

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const raw = cookieStore.get("teera_user")?.value;

    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}