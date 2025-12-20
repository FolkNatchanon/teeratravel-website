import { cookies } from "next/headers";

export type SessionUser = {
    user_id: number;
    username: string;
    email: string;
    role: string; // 'A' | 'U'
};

export async function getCurrentUser(): Promise<SessionUser | null> {
    try {
        // Next.js บางเวอร์ชัน cookies() เป็น async → ใช้ await จะไม่พัง
        const cookieStore = await cookies();
        const raw = cookieStore.get("teera_user")?.value;
        if (!raw) return null;

        const parsed = JSON.parse(raw);

        // รองรับหลายรูปแบบ cookie (เผื่อของเดิมเก็บเป็น { user: {...} })
        const u = parsed?.user ?? parsed;

        if (!u?.user_id) return null;

        return {
            user_id: Number(u.user_id),
            username: String(u.username ?? ""),
            email: String(u.email ?? ""),
            role: String(u.role ?? ""),
        };
    } catch {
        return null;
    }
}

export async function requireAdmin() {
    const user = await getCurrentUser();
    if (!user || user.role !== "A") return null;
    return user;
}