import { cookies } from "next/headers";
import type { TeeraUserCookie } from "./types";

const COOKIE_NAME = "teera_user";

// ✅ ต้อง async
export async function getAuthCookie(): Promise<TeeraUserCookie | null> {
    const cookieStore = await cookies(); // 🔥 จุดสำคัญ
    const raw = cookieStore.get(COOKIE_NAME)?.value;
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);

        if (
            typeof parsed?.user_id === "number" &&
            typeof parsed?.username === "string" &&
            (parsed?.role === "A" || parsed?.role === "U")
        ) {
            return parsed as TeeraUserCookie;
        }
        return null;
    } catch {
        return null;
    }
}

export async function setAuthCookie(user: TeeraUserCookie) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, JSON.stringify(user), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });
}

export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
    });
}